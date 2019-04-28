import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET
});


exports.uploads = file => new Promise((resolve) => {
  cloudinary.uploader.upload(file, (result) => {
    resolve({ url: result.url, id: result.public_id });
  }, { resource_type: 'auto' });
});
