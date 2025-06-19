const { Upload } = require("@aws-sdk/lib-storage");
const path = require("path");
const crypto = require("crypto");
const s3Client = require("../../utils/s3"); 
const Evidence = require("../../models/evidence");

async function uploadFile(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }

        const ext = path.extname(req.file.originalname);
        const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;

        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: filename,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                ACL: 'public-read'
            },
        });

        await upload.done();

        const fileUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${filename}`;

        res.status(201).json({
            message: "File uploaded successfully",
            fileUrl
        });
    } catch (error) {
        console.error("File upload error:", error);
        res.status(500).json({ message: "File upload failed", error: error.message });
    }
}

async function addEvidence(req, res){
    try {
        const {
            name,
            description,
            implementationGuidance,
            owner,
            sourceType,       // 'File' or 'URL'
            URL,              // for sourceType = 'URL'
            creationDate,
            frequency,
            nextRenewalDate,
            linkedControls,
            status,
            user,
            company
        } = req.body;

        let source = {};

        // 🔄 Handle File or URL
        if (sourceType === 'File') {
            if (!req.file) {
                return res.status(400).json({ message: 'File is required when sourceType is File' });
            }

            const ext = path.extname(req.file.originalname);
            const filename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;

            const s3Upload = new Upload({
                client: s3Client,
                params: {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: filename,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype,
                    ACL: 'public-read',
                },
            });

            await s3Upload.done();

            const fileUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${filename}`;
            source = { type: 'File', value: fileUrl };

        } else if (sourceType === 'URL') {
            if (!URL) {
                return res.status(400).json({ message: 'URL is required when sourceType is URL' });
            }

            source = { type: 'URL', value: URL };
        } else {
            return res.status(400).json({ message: 'Invalid sourceType. Must be "File" or "URL".' });
        }

        const newEvidence = new Evidence({
            name,
            description,
            implementationGuidance,
            owner,
            source,
            creationDate,
            frequency,
            nextRenewalDate,
            linkedControls,
            status,
            user,
            company,
        });

        const savedEvidence = await newEvidence.save();
        res.status(201).json(savedEvidence);

    } catch (error) {
        console.error('❌ Error adding evidence:', error);
        res.status(500).json({ message: 'Evidence creation failed', error: error.message });
    }

}

async function viewEvidencesById(req, res){
    try {
        const { companyId } = req.params; // Extract company ID from query string

        const evidences = await Evidence.find({company: companyId})
            .populate('owner', 'username email')
            .populate('user', 'username')
            .populate('company', 'details.fullLegalName')
            .populate('linkedControls', 'name frameworkRefs')
            .sort({ createdAt: -1 });

        res.status(200).json(evidences);
    } catch (err) {
        console.error('❌ Error fetching evidences:', err);
        res.status(500).json({ error: 'Failed to fetch evidences' });
    }

}

module.exports = {
    uploadFile: uploadFile,
    addEvidence: addEvidence,
    viewEvidencesById: viewEvidencesById
}