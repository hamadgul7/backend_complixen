const ControlCode = require('../models/controlCodes-model');
const Control = require('../models/Administration/adminControls-model');
const { get } = require('mongoose');

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
        const { framework, controlCode } = req.query;

        const filter = {};

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
        res.status(200).json(controlCodes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    addControlCode: addControlCode,
    getControlCodes: getControlCodes    
};  