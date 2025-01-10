//authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      if (user.isBanned) {
        return res.status(403).json({ 
          success: false, 
          message: 'Your account has been banned' 
        });
      }

      req.user = user;
      next();
    } catch (error) {
      // Xử lý cụ thể cho lỗi token hết hạn
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Token has expired, please login again',
          isExpired: true  // Flag để frontend biết cần redirect về login
        });
      }
      throw error;  // Ném các lỗi khác để xử lý ở catch bên ngoài
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
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

const adminOrManagerMiddleware = (req, res, next) => {
  if (req.user.role === 'ADMIN' || req.user.role === 'MANAGER') {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied, admin or manager only" });
  }
};

const authorOrAdminOrManagerMiddleware = async (req, res, next) => {
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

export { authMiddleware, adminOrManagerMiddleware, authorOrAdminOrManagerMiddleware };