import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/sendEmail.js";
import crypto from "crypto";


export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "Please enter all fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const defaultProfile = {
      name: username,
      avatar: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", // Replace with the actual URL of the default avatar image
      bio: "This is a default bio"
    };

    const newUser = new User({ username, email, passwordHash, profile: defaultProfile });
    await newUser.save();

    // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res.status(201).json({ success: true, token, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (user.isBanned) {
      const admin = await User.findOne({ role: 'ADMIN' });
      const adminContact = admin ? admin.email : 'administrator';
      
      return res.status(403).json({
        success: false,
        message: `Your account has been banned. Please contact administrator at ${adminContact}`
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Update lastLogin field
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(200).json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const verificationCodes = new Map();

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const code = crypto.randomBytes(3).toString('hex');
    verificationCodes.set(email, code);

    await sendEmail(email, 'Password Reset Verification Code', `Your verification code is: ${code}`);

    res.status(200).json({ success: true, message: "Verification code sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const storedCode = verificationCodes.get(email);
    if (storedCode !== code) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await User.updateOne({ email }, { passwordHash });

    verificationCodes.delete(email);

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const checkToken = async (req, res) => {
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

    res.status(200).json({ success: true, message: "Token is valid", user });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token has expired" });
    }
    console.error(error);
    res.status(401).json({ success: false, message: "Token is not valid" });
  }
};