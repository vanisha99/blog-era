const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { upload, optimizeImage } = require('../middleware/upload.middleware');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/categories', blogController.getCategories);
router.get('/:slug', blogController.getBlogBySlug);

// Protected routes
router.post('/', 
    authenticate, 
    authorize('blogger', 'admin'),
    upload.single('coverImage'),
    optimizeImage,
    blogController.createBlog
);

router.post('/category',
    authenticate,
    authorize('blogger', 'admin'),
    blogController.createCategory
);

router.put('/:id',
    authenticate,
    authorize('blogger', 'admin'),
    upload.single('coverImage'),
    optimizeImage,
    blogController.updateBlog
);

router.delete('/:id',
    authenticate,
    authorize('blogger', 'admin'),
    blogController.deleteBlog
);

router.post('/:id/comment',
    authenticate,
    blogController.addComment
);

router.post('/:id/like',
    authenticate,
    blogController.toggleLike
);

router.post('/:id/bookmark',
    authenticate,
    blogController.toggleBookmark
);

module.exports = router;