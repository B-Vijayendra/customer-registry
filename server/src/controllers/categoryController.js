const Category = require('../models/Category');
const { success, fail } = require('../utils/responseFormatter');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return success(res, 200, 'Categories fetched', { categories });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private (admin)
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return fail(res, 400, 'Category name is required');

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) return fail(res, 400, 'Category already exists');

    const category = await Category.create({ name: name.trim(), description });
    return success(res, 201, 'Category created', { category });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private (admin)
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return fail(res, 404, 'Category not found');

    const { name, description, isActive } = req.body;
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (typeof isActive === 'boolean') category.isActive = isActive;

    await category.save();
    return success(res, 200, 'Category updated', { category });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private (admin)
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return fail(res, 404, 'Category not found');
    await category.deleteOne();
    return success(res, 200, 'Category deleted', null);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
