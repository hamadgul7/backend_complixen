const express = require('express');
const router = express.Router();
const {
    createFramework,
    getAllFrameworks,
    getFrameworkById,
    updateFramework,
    deleteFramework,
} = require('../controllers/frameworkController');

const { protect, authorizeRoles, adminOnly } = require('../middlewares/auth');

router.use(protect);

router.post('/', adminOnly, createFramework);
router.get('/', getAllFrameworks);
router.get('/:id', getFrameworkById);
router.put('/:id', authorizeRoles('admin'), updateFramework);
router.delete('/:id', authorizeRoles('admin'), deleteFramework);

module.exports = router;
