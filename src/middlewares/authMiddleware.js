//authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Kiểm tra token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Tìm user và kiểm tra trạng thái banned
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Kiểm tra nếu user bị banned
    if (user.isBanned) {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account has been banned. Please contact administrator.' 
      });
    }

    // Gán user vào request để sử dụng ở các middleware/controller tiếp theo
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const adminOrManagerMiddleware = (req, res, next) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin or Manager role required.' 
    });
  }
  next();
};

export const authorOrAdminOrManagerMiddleware = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.authorId.equals(req.user._id) || req.user.role === 'ADMIN' || req.user.role === 'MANAGER') {
      next();
    } else {
      res.status(403).json({ success: false, message: "Access denied, only the author, admin, or manager can update this post" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};