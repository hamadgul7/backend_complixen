const express = require("express");
const router = express.Router();
const multer = require("multer");
const fileController = require('../../controllers/companyOwner/companyEvidence-controller');

// Use memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Accept any file with key 'file'
router.post("/uploadFile", upload.single("file"), fileController.uploadFile);

module.exports = router;
