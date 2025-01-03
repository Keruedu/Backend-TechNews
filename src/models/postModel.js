import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Thêm categoryId
  tagsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }], // Thêm tagsId
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  upvotesCount: { type: Number, default: 0 },
  downvotesCount: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  totalCommentsCount: { type: Number, default: 0 },
  bookmarkedByAccountId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  isDeleted: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
});


const Post = mongoose.model("Post", postSchema);

export default Post;