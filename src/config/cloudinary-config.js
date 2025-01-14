import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cấu hình lưu trữ với Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'TechNew/Blog', // Thư mục lưu trữ trên Cloudinary
    format: async (req, file) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg') {
        return 'jpg';
      } else if (ext === '.png') {
        return 'png';
      } else if (ext === '.gif') {
        return 'gif';
      } else {
        return 'jpg';
      }
    },
    public_id: (req, file) => {
      const nameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
      const publicId = Date.now() + '-' + nameWithoutExt;
      console.log(`Public ID: ${publicId}`);
      return publicId;
    }
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  console.log(`File type: ${file.mimetype}`); 
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Invalid file type. Only jpg, png, and gif files are allowed.');
    error.status = 400;
    console.error('Error: Invalid file type');
    return cb(error, false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 * 1024 },
  fileFilter: fileFilter
});

export default upload;