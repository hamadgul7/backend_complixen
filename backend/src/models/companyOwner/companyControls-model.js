const mongoose = require('mongoose');

const companyControlSchema = new mongoose.Schema(
    {
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
        controlTemplate: {
            _id: mongoose.Schema.Types.ObjectId,
            code: String,
            name: String,
            description: String,
            question: String,
            activities: [{ type: String }],
            frameworks: {
                soc2: { type: Boolean, default: false },
                hipaa: { type: Boolean, default: false }
            },
            frameworkRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ComplianceFramework' }]
        },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        // policyApprover: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy' }, ya add karna hai temporary testing kelie commented hai
        requiredApprovalStage: {
            type: String,
            enum: ['Draft', 'Pending Approval', 'Approved', 'Rejected'],
            default: 'Draft'
        },
        isReady: { type: Boolean, default: false },
        scope: { type: String, enum: ['In Scope', 'Out of Scope'], default: 'In Scope' },
        evidence: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evidence' }],
    },  
    { timestamps: true }
);

const CompanyControl = mongoose.model('CompanyControl', companyControlSchema);
module.exports = CompanyControl;