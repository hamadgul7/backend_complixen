const Control = require('../../models/Administration/adminControls-model');

async function addControl(req, res){
    try {
    const {
        code,
        name,
        description,
        question, 
        activities,
        frameworks,
        frameworkRefs,
    } = req.body;

    const newControl = new Control({
        code,
        name,
        description,
        question,
        activities,
        frameworks: {
            soc2: frameworks?.soc2 || false,
            hipaa: frameworks?.hipaa || false
        },
        frameworkRefs,
    });

    const savedControl = await newControl.save();
    res.status(201).json(savedControl);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function viewAllControls(req, res){
    try {
        console.log('Viewing all controls');
    const controls = await Control.find()
      .populate('frameworkRefs', 'name')                          
    res.status(200).json(controls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function viewControlsById(req, res){
    try {
    const controlId = req.params.id;

    const control = await Control.findById(controlId)
      .populate('frameworkRefs', 'name description')

    if (!control) {
      return res.status(404).json({ message: 'Control not found' });
    }

    res.status(200).json(control);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateControlById(req, res){
    try {
        const controlId = req.params.id;

        const {
            code,
            name,
            description,
            question,
            activities,
            frameworks,
            frameworkRefs,
        } = req.body;

        const updatedFields = {
            code,
            name,
            description,
            question,
            activities,
            frameworks: {
                soc2: frameworks?.soc2 || false,
                hipaa: frameworks?.hipaa || false
            },
            frameworkRefs
        };

        const updatedControl = await Control.findByIdAndUpdate(
            controlId,
            updatedFields,
            { new: true, runValidators: true }
        );

        if (!updatedControl) {
            return res.status(404).json({ message: 'Control not found' });
        }

        res.status(200).json(updatedControl);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Control code must be unique.' });
        }
        res.status(400).json({ error: err.message });
    }
}

async function deleteControlById(req, res){
    try {
    const controlId = req.params.id;

    const deletedControl = await Control.findByIdAndDelete(controlId);

    if (!deletedControl) {
        return res.status(404).json({ message: 'Control not found' });
    }

    res.status(200).json({ message: 'Control deleted successfully', deletedControl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    addControl: addControl,
    viewAllControls: viewAllControls,
    viewControlsById: viewControlsById,
    updateControlById: updateControlById,
    deleteControlById: deleteControlById
}