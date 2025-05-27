const mongoose = require('mongoose');

const controlSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String },
        question: { type: String },
        activities: [{ type: String }],
        frameworks: {
            soc2: { type: Boolean, default: false },
            hipaa: { type: Boolean, default: false }
        },
        frameworkRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ComplianceFramework' }],
        // mappedRequirements: [
        //     {   
        //         type: mongoose.Schema.Types.ObjectId, ref: 'ControlCode',
        //     }
        // ]
    }, 
    { timestamps: true }
);

const Control = mongoose.model('Control', controlSchema);
module.exports = Control;

























//     code: { type: String, required: true, unique: true },  // e.g., DCF-37
//     name: { type: String, required: true },                // e.g., Acceptable Use Policy
//     description: { type: String },
//     question: { type: String },                            // Compliance question
//     activities: { type: String },                          // What needs to be done

//     // Linked users
//     owners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//     approvers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//     requiredApprovalStage: { 
//         type: String, 
//         enum: ['Draft', 'Pending Approval', 'Approved', 'Rejected'], 
//         default: 'Draft' 
//     },

//     // Status & scope
//     isReady: { type: Boolean, default: false },
//     scope: { type: String, enum: ['In Scope', 'Out of Scope'], default: 'In Scope' },

//     // Framework mapping flags (boolean or array for flexibility)
//     frameworks: {
//         soc2: { type: Boolean, default: false },
//         hipaa: { type: Boolean, default: false }
//         // Add more frameworks as needed
//     },

//     // Optional: to track the related framework, if needed for reuse
//     frameworkRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ComplianceFramework' }],

//     // Optional: evidence field
//     evidence: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evidence' }]
    
// }, { timestamps: true }
