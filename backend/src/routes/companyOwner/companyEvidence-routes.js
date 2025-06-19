const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fileController = require('../../controllers/companyOwner/companyEvidence-controller');


const allowedExtensions = [
  '.pdf', '.docx', '.odt', '.xlsx', '.ods', '.pptx', '.odp',
  '.gif', '.jpeg', '.jpg', '.png', '.csv', '.zip', '.txt', '.json'
];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`), false);
  }
};

const upload = multer({ storage, fileFilter });

// Accept any file with key 'file'
router.post("/uploadFile", upload.single("file"), fileController.uploadFile);
router.post("/addEvidence", upload.single("file"), fileController.addEvidence);    
router.get("/viewEvidencesById/:companyId", fileController.viewEvidencesById);

module.exports = router;
