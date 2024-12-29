import Tag from "../models/tagModel.js";

export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find({});
    res.status(200).json({ success: true, data: tags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const createTag = async (req, res) => {
  const { name, slug, isActive } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ success: false, message: 'Please enter all fields' });
  }

  try {
    const newTag = new Tag({ name, slug, isActive });
    await newTag.save();
    res.status(201).json({ success: true, data: newTag });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateTag = async (req, res) => {
  const { id } = req.params;
  const { name, slug, isActive } = req.body;

  try {
    const updatedTag = await Tag.findByIdAndUpdate(id, { name, slug, isActive }, { new: true });
    res.status(200).json({ success: true, data: updatedTag });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteTag = async (req, res) => {
  const { id } = req.params;

  try {
    await Tag.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Tag deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};