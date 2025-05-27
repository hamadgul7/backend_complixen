const express = require("express");
const router = express.Router();
const multer = require('multer');
const companyOwnerController = require('../../controllers/companyOwner/companyController');

// Use memory storage since upload is handled manually in controller
const upload = multer({ storage: multer.memoryStorage() });

router.post('/addCompanyDetails/:id', upload.single('logo'), companyOwnerController.addCompanyDetails);
router.get('/getCompanyDetails/:id', companyOwnerController.getCompanyDetails);
router.post('/updateCompanyDetails/:id', upload.single('logo'), companyOwnerController.updateCompanyDetails);

module.exports = router;
