const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

        implementationGuidance: {
            type: String,
        },
        
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        source: {
            type: String,
            required: true,
        },
        
        creationDate: {
            type: Date,
            required: true,
        },

        renewal: {
            frequency: {
                type: String,
                enum: ['Monthly', 'Quarterly', 'Biannually', 'Annually', 'Custom'],
            },
            nextRenewalDate: {
                type: Date,
            },
        },

        linkedControls: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Control',
            },
        ],

        fileUrl: {
            type: String,
        },

        status: {
            type: String,
            enum: ['Uploaded', 'Under Review', 'Approved', 'Rejected'],
            default: 'Uploaded',
        },
    },
    { timestamps: true }
);

const Evidence = mongoose.model('Evidence', evidenceSchema);

module.exports = Evidence;
