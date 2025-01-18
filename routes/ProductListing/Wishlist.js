const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/Wishlist');

router.post('/add', Controller.addToWishlist);
router.get('/get/:userId', Controller.getWishlist);
router.delete('/delete', Controller.removeFromWishlist);

module.exports = router;
