const Blog = require('../models/Blog');
const User = require('../models/User');
const Category = require('../models/Category');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalBlogs = await Blog.countDocuments();
        const publishedBlogs = await Blog.countDocuments({ status: 'published' });
        const draftBlogs = await Blog.countDocuments({ status: 'draft' });
        const totalUsers = await User.countDocuments();
        const totalBloggers = await User.countDocuments({ role: 'blogger' });
        const totalCategories = await Category.countDocuments();
        
        const recentBlogs = await Blog.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .limit(10);

        const popularBlogs = await Blog.find({ status: 'published' })
            .populate('author', 'username')
            .sort({ views: -1 })
            .limit(5);

        const topBloggers = await User.aggregate([
            { $match: { role: 'blogger' } },
            {
                $lookup: {
                    from: 'blogs',
                    localField: '_id',
                    foreignField: 'author',
                    as: 'blogs'
                }
            },
            {
                $project: {
                    username: 1,
                    email: 1,
                    profilePicture: 1,
                    blogCount: { $size: '$blogs' },
                    totalViews: { $sum: '$blogs.views' }
                }
            },
            { $sort: { blogCount: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            stats: {
                totalBlogs,
                publishedBlogs,
                draftBlogs,
                totalUsers,
                totalBloggers,
                totalCategories
            },
            recentBlogs,
            popularBlogs,
            topBloggers
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllBlogsAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, author } = req.query;
        
        const query = {};
        if (status) query.status = status;
        if (author) query.author = author;

        const blogs = await Blog.find(query)
            .populate('author', 'username email')
            .populate('category', 'name')
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

exports.deleteBlogAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        
        const blog = await Blog.findById(id);
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        await Blog.findByIdAndDelete(id);

        // Update category blog count
        if (blog.category) {
            await Category.findByIdAndUpdate(blog.category, {
                $inc: { blogCount: -1 }
            });
        }

        res.json({ message: 'Blog deleted successfully by admin' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        const usersWithStats = await Promise.all(users.map(async (user) => {
            const blogCount = await Blog.countDocuments({ author: user._id });
            return {
                ...user.toObject(),
                blogCount
            };
        }));

        res.json(usersWithStats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json({
            message: 'User role updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};