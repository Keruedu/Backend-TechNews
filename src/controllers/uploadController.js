import upload from '../config/cloudinary-config.js';
import fs from 'fs';

export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  res.status(200).json({
    success: true,
    url: req.file.path
  });
};