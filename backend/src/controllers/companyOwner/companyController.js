const Company = require('../../models/companyOwner/companyDetails-model')
const User = require('../../models/user');
const { Upload } = require('@aws-sdk/lib-storage');
const path = require('path');
const crypto = require('crypto');
const s3Client = require('../../utils/s3');
const CompanyControl = require('../../models/companyOwner/companyControls-model');

async function addCompanyDetails(req, res) {
    try {
        const userId = req.params.id;
        const { details, compliance } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Logo file is required' });
        }

        const ext = path.extname(req.file.originalname);
        const filename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;

        // Upload logo to S3 using AWS SDK v3
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: filename,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                ACL: 'public-read',
            }
        });

        await upload.done();

        const logoUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${filename}`;
        const user = await User.findById(userId).select('assignedFrameworks');

        const newCompany = new Company({
            logo: logoUrl,
            details: JSON.parse(details),
            compliance: JSON.parse(compliance),
            frameworks: user.assignedFrameworks,
            createdBy: userId
        });

        const savedCompany = await newCompany.save();

        // 🔽 Append this block to update CompanyControl entries
        await CompanyControl.updateMany(
            { user: userId },
            { $set: { company: savedCompany._id } }
        );

        const userDetails = await User.findByIdAndUpdate(
            userId,
            { $set: { company: savedCompany._id } }
        );

        const controlsToUpdate = await CompanyControl.find({ owner: userId });
        for (const control of controlsToUpdate) {
            if (control.controlTemplate?.description?.includes('<CompanyName>')) {
                control.controlTemplate.description = control.controlTemplate.description.replace(
                    /<CompanyName>/g,
                    savedCompany.details.fullLegalName
                );
                await control.save();
            }
        }

        res.status(201).json(savedCompany);

    } catch (error) {
        console.error('Error creating company:', error);
        res.status(500).json({ message: 'Failed to create company', error: error.message });
    }

}

async function getCompanyDetails(req, res){
    try {
        const company = await Company.findOne({createdBy: req.params.id})
            .populate('createdBy', 'name email')
            .populate('frameworks', 'name');
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving company', error: error.message });
    }
}

async function updateCompanyDetails(req, res){
     try {
        const companyId = req.params.id;

        // Parse JSON fields safely
        let parsedDetails, parsedCompliance;
        try {
            parsedDetails = JSON.parse(req.body.details);
            parsedCompliance = JSON.parse(req.body.compliance);
        } catch (err) {
            return res.status(400).json({ message: 'Invalid JSON in details or compliance' });
        }

        // Prepare update object
        const updateData = {
            details: {
                emailDomain: parsedDetails.emailDomain,
                commonName: parsedDetails.commonName,
                fullLegalName: parsedDetails.fullLegalName,
                productName: parsedDetails.productName,
                incorporationYear: parsedDetails.incorporationYear,
                phoneNumber: parsedDetails.phoneNumber,
                companyDescription: parsedDetails.companyDescription,
                mailingAddress: parsedDetails.mailingAddress,
                productDescription: parsedDetails.productDescription,
                howItWorks: parsedDetails.howItWorks,
                accountId: parsedDetails.accountId,
                dataResidencyLocation: parsedDetails.dataResidencyLocation
            },
            compliance: {
                privacyPolicyUrl: parsedCompliance.privacyPolicyUrl,
                termsOfUseUrl: parsedCompliance.termsOfUseUrl,
                supportUrl: parsedCompliance.supportUrl,
                securityEmail: parsedCompliance.securityEmail
            }
        };

        // Handle logo upload or removal
        if (req.file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({ message: 'Invalid file type. Only JPG, PNG, WEBP allowed.' });
            }

            const ext = path.extname(req.file.originalname);
            const filename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;

            const upload = new Upload({
                client: s3Client,
                params: {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: filename,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype,
                    ACL: 'public-read',
                }
            });

            await upload.done();

            const logoUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${filename}`;
            updateData.logo = logoUrl;

        } else if (req.body.logo === 'null') {
            updateData.logo = null;
        }

        const updatedCompany = await Company.findByIdAndUpdate(companyId, updateData, { new: true });

        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json(updatedCompany);
    } catch (error) {
        console.error('Update Company Error:', error);
        res.status(500).json({ message: 'Failed to update company', error: error.message });
    }
}

module.exports = {
    addCompanyDetails: addCompanyDetails,
    getCompanyDetails: getCompanyDetails,
    updateCompanyDetails: updateCompanyDetails
}