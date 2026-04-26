const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

// Add comment to a blog
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const blogId = req.params.blogId;
    const userId = req.userId;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comment = new Comment({
      content,
      blog: blogId,
      author: userId
    });

    await comment.save();
    await comment.populate('author', 'username');

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get comments for a blog
exports.getComments = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const comments = await Comment.find({ blog: blogId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete comment (owner or admin only)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const user = await User.findById(req.userId);
    if (comment.author.toString() !== req.userId && user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};