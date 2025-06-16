const ControlCode = require('../models/controlCodes-model');
const Control = require('../models/Administration/adminControls-model');
const { get } = require('mongoose');
const Company = require('../models/companyOwner/companyDetails-model'); 

async function addControlCode(req, res) {
    try {
        const { framework, code, requirement, relatedControls } = req.body;
        const newControlCode = new ControlCode({
            framework,
            code,
            requirement,
            relatedControls
        });
        const savedControlCode = await newControlCode.save();
        res.status(201).json({ message: 'Control code added successfully', savedControlCode});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function getControlCodes(req, res) {
   try {
    const { companyId, controlCode } = req.query;

    if (!companyId) {
        return res.status(400).json({ error: 'companyId is required' });
    }

    // Get company and populate frameworks
    const company = await Company.findById(companyId).populate({
        path: 'frameworks',
        select: 'name'
    });

    if (!company) {
        return res.status(404).json({ error: 'Company not found' });
    }

    const filter = {};

    // Use framework names from the company
    const framework = company.frameworks.map(f => f.name);

    if (framework) {
        const frameworkArray = Array.isArray(framework)
        ? framework.map(f => f.trim())
        : framework.split(',').map(f => f.trim());

        filter.framework = { $in: frameworkArray };
    }

    if (controlCode) {
        filter.relatedControls = controlCode;
    }

    console.log("MongoDB filter:", JSON.stringify(filter, null, 2));

    const controlCodes = await ControlCode.find(filter);
    console.log("Control codes:", controlCodes);   
    res.status(200).json(controlCodes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    addControlCode: addControlCode,
    getControlCodes: getControlCodes    
};  