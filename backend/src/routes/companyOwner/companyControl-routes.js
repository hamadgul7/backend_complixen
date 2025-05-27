const express = require("express");
const router = express.Router();

const companyControlsController = require('../../controllers/companyOwner/companyControl-controller');


router.get('/getCompanyControlsById/:id', companyControlsController.getCompanyControlsById);
router.post('/updateCompanyControl/:id', companyControlsController.updateCompanyControl);

module.exports = router;