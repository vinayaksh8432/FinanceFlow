const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/"); // Updated to save in public/uploads directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

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
    upload(req, res, function (err) {
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
        next();
    });
};

module.exports = uploadMiddleware;
