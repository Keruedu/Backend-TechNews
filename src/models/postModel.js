import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }, // Thêm ref: 'Account'
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  upvotesCount: { type: Number, default: 0 },
  downvotesCount: { type: Number, default: 0 },
  commentsID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Thêm ref: 'Comment'
  totalCommentsCount: { type: Number, default: 0 },
  bookmarkedByAccountId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }], // Thêm ref: 'Account'
  status: { type: String, default: 'active' },
  isDeleted: { type: Boolean, default: false }
});

const Post = mongoose.model("Post", blogSchema);

export default Post;
