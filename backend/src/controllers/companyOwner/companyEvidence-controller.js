const { Upload } = require("@aws-sdk/lib-storage");
const path = require("path");
const crypto = require("crypto");
const s3Client = require("../../utils/s3"); 

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

module.exports = {
    uploadFile: uploadFile
}