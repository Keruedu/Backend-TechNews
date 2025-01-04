import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  bio: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['USER', 'MANAGER', 'ADMIN'], default: 'USER' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  bookmarkedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  upvotedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  downvotedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  profile: profileSchema,
  isBanned: { type: Boolean, default: false },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const User = mongoose.model("User", userSchema);

export default User;