const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// now we access our our cloudinary in our express using 

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// ------- For storage to store our images, we make a folder using this
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Wanderlust_dev',
        allowerdFormats: ["png", "jpg", "jpeg"], // supports promises as well
        
    },
});

module.exports = {
    cloudinary,
     storage,
}