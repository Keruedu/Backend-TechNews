import cloudinary from '../config/cloudinary-config.cjs';

export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'uploads'
    });
    return result;
  } catch (error) {
    throw new Error('Cloudinary upload failed');
  }
};