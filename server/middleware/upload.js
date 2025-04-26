const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Use the absolute path
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        // Sanitize filename to avoid issues
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
        cb(null, `${uniqueSuffix}-${sanitizedName}`);
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
    // Special handling for Vercel and other serverless environments
    if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
        // For Vercel, we can't directly save files to disk in production
        // Instead, you might want to use a service like AWS S3, Firebase Storage, etc.
        // For now, we'll still handle the upload but with a warning
        console.warn(
            "Running on Vercel - file uploads will be temporary and may not persist"
        );
    }

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

        // Add the file URL to the request for easier access
        if (req.file) {
            const baseUrl =
                process.env.NODE_ENV === "production"
                    ? "https://financeflowserver.vercel.app"
                    : `http://localhost:${process.env.PORT || 3000}`;

            req.file.url = `${baseUrl}/uploads/${req.file.filename}`;
        }

        next();
    });
};

module.exports = uploadMiddleware;
