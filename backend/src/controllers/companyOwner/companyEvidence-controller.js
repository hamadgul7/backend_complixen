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
        if (!req.file) {
            return res.status(400).json({ message: 'File is required' });
        }

        // Generate unique filename
        const ext = path.extname(req.file.originalname);
        const filename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;

        // Upload file to S3
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

        // Generate public file URL
        const fileUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${filename}`;

        // Extract form data
        const {
            name,
            description,
            implementationGuidance,
            owner,
            creationDate,
            renewal,
            linkedControls,
            status,
        } = req.body;

        // Parse nested renewal JSON if necessary
        const parsedRenewal = renewal ? JSON.parse(renewal) : undefined;

        // Create Evidence
        const newEvidence = new Evidence({
            name,
            description,
            implementationGuidance,
            owner,
            source: req.file.originalname,
            creationDate,
            renewal: parsedRenewal,
            linkedControls,
            fileUrl,
            status,
        });

        const savedEvidence = await newEvidence.save();
        res.status(201).json(savedEvidence);
    } catch (error) {
        console.error('❌ Error adding evidence:', error);
        res.status(500).json({ message: 'File upload failed', error: error.message });
    }
}

async function viewEvidence(req, res){
    try {
        const evidences = await Evidence.find()
            .populate('owner', 'username email') // Adjust as needed
            .populate('linkedControls', 'name frameworkRefs') // Adjust as needed
            .sort({ createdAt: -1 }); // Optional: newest first

        res.status(200).json(evidences);
    } catch (err) {
        console.error('❌ Error fetching evidences:', err);
        res.status(500).json({ error: 'Failed to fetch evidences' });
    }
}

module.exports = {
    uploadFile: uploadFile,
    addEvidence: addEvidence,
    viewEvidence: viewEvidence
}