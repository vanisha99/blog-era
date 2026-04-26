const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const commentController = require('../controllers/comment.controller');

router.post('/blogs/:blogId/comments', authenticate, commentController.addComment);
router.get('/blogs/:blogId/comments', commentController.getComments);
router.delete('/comments/:id', authenticate, commentController.deleteComment);

module.exports = router;