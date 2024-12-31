const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/BulkUpload');
const {storage} = require('../../utils/multer');
const multer = require('multer');

const upload = multer({ storage: storage }); // Use defined storage
// Route to send the verification email
router.post('/', upload.single('file'), Controller.BulkUpload);

module.exports = router;
