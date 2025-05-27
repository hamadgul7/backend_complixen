const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ['document', 'screenshot', 'log', 'note'], required: true },
        description: String,
        fileUrl: String, 
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        control: { type: mongoose.Schema.Types.ObjectId, ref: 'Control' },
        status: {
            type: String,
            enum: ['Uploaded', 'Under Review', 'Approved', 'Rejected'],
            default: 'Uploaded'
        }
    }, 
    { timestamps: true }
);

const Evidence = mongoose.model('Evidence', evidenceSchema);

module.exports = Evidence;
