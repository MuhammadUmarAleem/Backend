const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/GetProducts');

// Route to send the verification email
router.get('/:sellerid/getProducts/:pageno', Controller.GetProducts);
router.get('/:sellerid/getProduct/:productId', Controller.GetProduct);
router.delete('/:sellerid/deleteProduct/:productId', Controller.DeleteProduct);

module.exports = router;
