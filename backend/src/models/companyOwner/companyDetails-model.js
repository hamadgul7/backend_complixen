const mongoose = require('mongoose');

const companyDetailsSchema = new mongoose.Schema(
    {
        logo: { type: String }, // URL or S3 path or upload reference

        // ===== Details Section =====
        details: {
            emailDomain: { type: String, },
            commonName: { type: String, },
            fullLegalName: { type: String, },
            productName: { type: String,  },
            incorporationYear: { type: Number }, // e.g., 2015
            phoneNumber: { type: String },
            companyDescription: { type: String },
            mailingAddress: { type: String },
            productDescription: { type: String },
            howItWorks: { type: String },
            accountId: { type: String },
            dataResidencyLocation: { type: String } // e.g., 'USA', 'EU', etc.
        },

        // ===== Compliance Section =====
        compliance: {
            privacyPolicyUrl: { type: String },
            termsOfUseUrl: { type: String },
            supportUrl: { type: String },
            securityEmail: { type: String }
        },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        frameworks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ComplianceFramework' }]
    }, 
    { timestamps: true }
);

const Company = mongoose.model('Company', companyDetailsSchema);
module.exports = Company;
