const express = require("express");
const router = express.Router();

const controlCodesController = require('../controllers/controlCodes-controller');

router.post('/addControlCode', controlCodesController.addControlCode);
router.get('/getControlCodes', controlCodesController.getControlCodes);

module.exports = router;    