import { uploadToCloudinary } from '../services/cloudinaryService.js';
import fs from 'fs';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.path);

    // Remove the file from the server after uploading to Cloudinary
    fs.unlinkSync(req.file.path);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};