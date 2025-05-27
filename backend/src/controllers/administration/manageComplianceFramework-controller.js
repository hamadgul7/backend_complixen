const ComplianceFramework = require('../../models/complianceFramework');

async function addComplianceFramework(req, res){
    try {

        const userId = req.params.id;
        const { name, description, isActive } = req.body;

        const newFramework = new ComplianceFramework(
            {
                name,
                description,
                createdBy: userId,
                isActive
            }
        );

        const savedFramework = await newFramework.save();
        res.status(201).json(
            {
                savedFramework,
                message: "Compliance Framework Added Successfully"
            }
        );
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function getAllComplianceFrameworks(req, res){
    try {
    const frameworks = await ComplianceFramework.find()
      .populate('createdBy', 'name email') 
      .populate('controls', 'code name');  

    res.status(200).json(
        {
            frameworks,
            message: "All Compliance Frameworks Fetched Successfully"
        }
    );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getComplianceFrameworkById(req, res){
    try {
        const frameworkId = req.params.id;

        const framework = await ComplianceFramework.findById(frameworkId)
        .populate('createdBy', 'name email')
        .populate('controls', 'code name description');

        if (!framework) {
        return res.status(404).json({ error: 'Compliance Framework not found' });
        }

        res.status(200).json(framework);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateComplianceFramework(req, res){
    try {
        const frameworkId = req.params.id;
        const { name, description, createdBy, controls, isActive } = req.body;

        const updatedFramework = await ComplianceFramework.findByIdAndUpdate(
        frameworkId,
        {
            name,
            description,
            createdBy,
            controls,
            isActive
        },
        { new: true }
        )
        .populate('createdBy', 'name email')
        .populate('controls', 'code name');

        if (!updatedFramework) {
            return res.status(404).json({ error: 'Compliance Framework not found' });
        }

        res.status(200).json(updatedFramework);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function deleteComplianceFrameworkById(req, res){
    try {
        const frameworkId = req.params.id;

        const deletedFramework = await ComplianceFramework.findByIdAndDelete(frameworkId);

        if (!deletedFramework) {
            return res.status(404).json({ error: 'Compliance Framework not found' });
        }

        res.status(200).json({ message: 'Framework deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    addComplianceFramework: addComplianceFramework,
    getAllComplianceFrameworks: getAllComplianceFrameworks,
    getComplianceFrameworkById: getComplianceFrameworkById,
    updateComplianceFramework: updateComplianceFramework,
    deleteComplianceFrameworkById: deleteComplianceFrameworkById
}