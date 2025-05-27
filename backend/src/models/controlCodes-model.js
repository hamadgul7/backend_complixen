const mongoose = require('mongoose');

const controlCodesSchema = new mongoose.Schema(
    {
        framework: { type: String, enum: ['SOC 2', 'HIPAA'], required: true },
        code: String,
        requirement: String,
        relatedControls: [{ type: String }],

    },   
    { timestamps: true }
);
const ControlCode  = mongoose.model('ControlCode', controlCodesSchema);
module.exports = ControlCode;
