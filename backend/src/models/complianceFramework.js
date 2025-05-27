const mongoose = require('mongoose');

const frameworkSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: String,
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        controls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Control' }],
        isActive: { type: Boolean, default: true },
    },   
    { timestamps: true }
);
const ComplianceFramework  = mongoose.model('ComplianceFramework', frameworkSchema);
module.exports = ComplianceFramework;


                























// {
    //     name: { type: String, required: true },
    //     description: String,
    //     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //     controls: [
    //     {
    //         title: String,
    //         description: String,
    //         isActive: { type: Boolean, default: true },
    //     },
    //     ],
    // },




// const frameworkSchema = new mongoose.Schema(
//     {
//         name: { type: String, required: true },
//         description: String,
//         createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//         controls: [
//         {
//             title: String,
//             description: String,
//             isActive: { type: Boolean, default: true },
//         },
//         ],
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model('ComplianceFramework', frameworkSchema);
