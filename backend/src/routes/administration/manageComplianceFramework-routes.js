const express = require("express");
const router = express.Router();

const adminManageComplianceFrameworkController = require('../../controllers/administration/manageComplianceFramework-controller');

router.post('/addComplianceFramework/:id', adminManageComplianceFrameworkController.addComplianceFramework);
router.get('/getAllComplianceFrameworks', adminManageComplianceFrameworkController.getAllComplianceFrameworks);
router.get('/getComplianceFrameworkById/:id', adminManageComplianceFrameworkController.getComplianceFrameworkById);
router.post('/updateComplianceFramework/:id', adminManageComplianceFrameworkController.updateComplianceFramework);
router.post('/deleteComplianceFrameworkById/:id', adminManageComplianceFrameworkController.deleteComplianceFrameworkById);

module.exports = router;