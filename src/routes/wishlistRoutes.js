const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:catalogId', authMiddleware, wishlistController.addToWishlist);
router.delete('/:catalogId', authMiddleware, wishlistController.removeFromWishlist);
router.get('/', authMiddleware, wishlistController.getWishlist);

module.exports = router;
