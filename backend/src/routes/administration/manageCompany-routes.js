const express = require("express");
const router = express.Router();

const adminManageCompanyController = require('../../controllers/administration/manageCompany-controller');


router.post('/deleteCompanyById/:id', adminManageCompanyController.deleteCompanyById);


module.exports = router;