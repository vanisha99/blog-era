const Blog = require('../models/Blog');
const Category = require('../models/Category');
const User = require('../models/User');

exports.createBlog = async (req, res) => {
    try {
        const { title, content, category, tags, status } = req.body;
        
        const blogData = {
            title,
            content,
            author: req.user._id,
            status: status || 'draft'
        };

        if (category) {
            const categoryDoc = await Category.findById(category);
            if (categoryDoc) {
                blogData.category = category;
                categoryDoc.blogCount += 1;
                await categoryDoc.save();
            }
        }

        if (tags) {
            blogData.tags = JSON.parse(tags);
        }

        if (req.file) {
            blogData.coverImage = `/uploads/${req.file.filename}`;
        }

        if (req.files && req.files.images) {
            blogData.images = req.files.images.map(file => `/uploads/${file.filename}`);
        }

        const blog = new Blog(blogData);
        await blog.save();

        await blog.populate('author', 'username profilePicture');
        await blog.populate('category', 'name slug');

        res.status(201).json({
            message: 'Blog created successfully',
            blog
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, tag, author, search } = req.query;
        
        const query = { status: 'published' };
        
        if (category) {
            const categoryDoc = await Category.findOne({ slug: category });
            if (categoryDoc) {
                query.category = categoryDoc._id;
            }
        }
        
        if (tag) {
            query.tags = tag;
        }
        
        if (author) {
            query.author = author;
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const blogs = await Blog.find(query)
            .populate('author', 'username profilePicture')
            .populate('category', 'name slug color')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Blog.countDocuments(query);

        res.json({
            blogs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOneAndUpdate(
            { slug: req.params.slug },
            { $inc: { views: 1 } },
            { new: true }
        )
        .populate('author', 'username profilePicture bio')
        .populate('category', 'name slug color')
        .populate('comments.user', 'username profilePicture');

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const blog = await Blog.findById(id);
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if user is the author or admin
        if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (req.file) {
            updates.coverImage = `/uploads/${req.file.filename}`;
        }

        Object.keys(updates).forEach(key => {
            blog[key] = updates[key];
        });

        await blog.save();
        await blog.populate('author', 'username profilePicture');
        await blog.populate('category', 'name slug');

        res.json({
            message: 'Blog updated successfully',
            blog
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        
        const blog = await Blog.findById(id);
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if user is the author or admin
        if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Blog.findByIdAndDelete(id);

        // Update category blog count
        if (blog.category) {
            await Category.findByIdAndUpdate(blog.category, {
                $inc: { blogCount: -1 }
            });
        }

        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const blog = await Blog.findById(id);
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.comments.push({
            user: req.user._id,
            content
        });

        await blog.save();
        
        const populatedBlog = await Blog.findById(id)
            .populate('comments.user', 'username profilePicture');

        const newComment = populatedBlog.comments[populatedBlog.comments.length - 1];

        res.status(201).json({
            message: 'Comment added successfully',
            comment: newComment
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const blog = await Blog.findById(id);
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const likeIndex = blog.likes.indexOf(userId);
        
        if (likeIndex === -1) {
            blog.likes.push(userId);
        } else {
            blog.likes.splice(likeIndex, 1);
        }

        await blog.save();

        res.json({
            message: likeIndex === -1 ? 'Blog liked' : 'Blog unliked',
            likes: blog.likes.length,
            isLiked: likeIndex === -1
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.toggleBookmark = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const user = await User.findById(userId);
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const bookmarkIndex = user.bookmarks.indexOf(id);
        
        if (bookmarkIndex === -1) {
            user.bookmarks.push(id);
        } else {
            user.bookmarks.splice(bookmarkIndex, 1);
        }

        await user.save();

        res.json({
            message: bookmarkIndex === -1 ? 'Blog bookmarked' : 'Bookmark removed',
            isBookmarked: bookmarkIndex === -1
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ blogCount: -1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name, description, color, icon } = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = new Category({
            name,
            description,
            color,
            icon,
            createdBy: req.user._id
        });

        await category.save();

        res.status(201).json({
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};