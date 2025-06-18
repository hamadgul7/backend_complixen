const CompanyControl = require('../../models/companyOwner/companyControls-model');
const Control = require('../../models/Administration/adminControls-model');
require('../../models/evidence');

async function getCompanyControlsById(req, res){
    try {
        const companyId  = req.params.id;
        const controls = await CompanyControl.find({ company: companyId })
        .populate('controlTemplate')
        .populate('owner', 'username')
        // .populate('policyApprover')
        .populate('evidence')
        .populate('controlTemplate.frameworkRefs', 'name');

        res.status(200).json(controls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getCompanyControlById(req, res){
    try {
        const id = req.params.id;

        const control = await CompanyControl.findOne({ 'controlTemplate._id': id })
            .populate('controlTemplate.frameworkRefs', 'name')
            .populate('owner', 'username');

        if (!control) {
            return res.status(404).json({ error: 'Control not found' });
        }

        res.status(200).json(control);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }  
}

async function updateCompanyControl(req, res){
    try {
        const id = req.params.id;
        const {
            requiredApprovalStage,
            isReady,
            scope,
            description // new field added for update
        } = req.body;

        const existingControl = await CompanyControl.findById(id);
        if (!existingControl) {
            return res.status(404).json({ error: 'CompanyControl not found' });
        }

        // Only update description if provided
        if (description) {
            existingControl.controlTemplate.description = description;
        }

        // Update other fields
        existingControl.owner = owner;
        existingControl.policyApprover = policyApprover;
        existingControl.requiredApprovalStage = requiredApprovalStage;
        existingControl.isReady = isReady;
        existingControl.scope = scope;

        const updatedControl = await existingControl.save();

        const populatedControl = await CompanyControl.findById(updatedControl._id)
            .populate('company')
            .populate('controlTemplate.frameworkRefs')
            .populate('owner')
            .populate('policyApprover')
            .populate('evidence');

        res.status(200).json(populatedControl);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

async function assignOwnerToControl(req, res){
    try {
        const { controlId, ownerId, userId } = req.body;

        if (!controlId || !ownerId || !userId) {
            return res.status(400).json({ error: 'controlId, ownerId, and userId are required' });
        }

        const existingControl = await CompanyControl.findOne({
            user: userId,
            'controlTemplate._id': controlId
        });

        if (!existingControl) {
            return res.status(404).json({ error: 'Matching CompanyControl not found' });
        }

        existingControl.owner = ownerId;
        const updatedControl = await existingControl.save();

        res.status(200).json(updatedControl);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getCompanyControlsById: getCompanyControlsById,
    getCompanyControlById: getCompanyControlById,
    updateCompanyControl: updateCompanyControl,
    assignOwnerToControl: assignOwnerToControl
}