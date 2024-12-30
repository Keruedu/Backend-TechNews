import Category from "../models/categoryModel.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const createCategory = async (req, res) => {
  const { name, slug, isActive } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ success: false, message: 'Please enter all fields' });
  }

  try {
    const newCategory = new Category({ name, slug, isActive });
    await newCategory.save();
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, slug, isActive } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, { name, slug, isActive }, { new: true });
    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};