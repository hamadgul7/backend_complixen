const express = require("express");
const router = express.Router();

const adminManageControlController = require('../../controllers/administration/manageControls-controller');

router.post('/addControl', adminManageControlController.addControl);
router.get('/viewAllControls', adminManageControlController.viewAllControls);
router.get('/viewControlsById/:id', adminManageControlController.viewControlsById);
router.post('/updateControlById/:id', adminManageControlController.updateControlById);
router.post('/deleteControlById/:id', adminManageControlController.deleteControlById);

module.exports = router;