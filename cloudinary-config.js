require('dotenv').config(); // Đọc biến môi trường từ file .env

const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloudinary configured successfully!');

module.exports = cloudinary; // Xuất để sử dụng ở nơi khác
