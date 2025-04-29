const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Function to upload a file buffer to Cloudinary
const uploadToCloudinary = async (fileBuffer, folder = "uploads") => {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            folder,
            resource_type: "auto",
        };

        // Upload the file buffer to Cloudinary
        cloudinary.uploader
            .upload_stream(uploadOptions, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            })
            .end(fileBuffer);
    });
};

module.exports = {
    cloudinary,
    uploadToCloudinary,
};
