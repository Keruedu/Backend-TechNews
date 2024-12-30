import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true }
});

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;