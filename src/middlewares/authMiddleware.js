import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Token is not valid" });
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