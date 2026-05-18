const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeReceipt } = require('../controllers/uploadController');

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/', upload.single('receipt'), analyzeReceipt);

module.exports = router;
