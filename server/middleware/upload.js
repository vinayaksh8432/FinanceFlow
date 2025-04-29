const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadToCloudinary } = require("../utils/cloudinary");

// Always use memory storage for both local and production environments
// This simplifies our approach by using Cloudinary in all environments
const storage = multer.memoryStorage();

// Configure multer upload settings
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Allow only specific file types
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Invalid file type. Only PDF, JPEG and PNG files are allowed."
                )
            );
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
}).single("document"); // 'document' matches the field name in FormData

// Create middleware function
const uploadMiddleware = (req, res, next) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                message: "File upload error",
                error: err.message,
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: "Error uploading file",
                error: err.message,
            });
        }

        // Process the file if it exists
        if (req.file) {
            try {
                // Upload the file to Cloudinary
                const result = await uploadToCloudinary(req.file.buffer);

                // Add Cloudinary information to the request object
                req.file.cloudinary = result;
                req.file.url = result.secure_url;
                req.file.publicId = result.public_id;

                console.log(
                    `File uploaded to Cloudinary: ${result.secure_url}`
                );

                next();
            } catch (cloudinaryError) {
                console.error("Cloudinary upload error:", cloudinaryError);
                return res.status(500).json({
                    success: false,
                    message: "Error uploading file to cloud storage",
                    error: cloudinaryError.message,
                });
            }
        } else {
            // No file was uploaded, continue to the next middleware
            next();
        }
    });
};

module.exports = uploadMiddleware;
