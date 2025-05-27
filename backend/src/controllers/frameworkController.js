const Framework = require('../models/complianceFramework');

const createFramework = async (req, res) => {
    const { name, description, controls } = req.body;

    console.log('Creating framework:', req.body);

    try {
        const framework = await Framework.create({
            name,
            description,
            controls,
            createdBy: req.user.userId,
        });

        res.status(201).json({ message: 'Framework created successfully', framework });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create framework' });
    }
};

const getAllFrameworks = async (req, res) => {
    const frameworks = await Framework.find().populate('createdBy', 'name email');
    res.json(frameworks);
};

const getFrameworkById = async (req, res) => {
    const framework = await Framework.findById(req.params.id);
    if (!framework) return res.status(404).json({ message: 'Not found' });
    res.json(framework);
};

const updateFramework = async (req, res) => {
    const framework = await Framework.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!framework) return res.status(404).json({ message: 'Not found' });
    res.json(framework);
};

const deleteFramework = async (req, res) => {
    await Framework.findByIdAndDelete(req.params.id);
    res.json({ message: 'Framework deleted' });
};

module.exports = {
    createFramework,
    getAllFrameworks,
    getFrameworkById,
    updateFramework,
    deleteFramework,
};
