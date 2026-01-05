import Subcategory from '../models/Subcategory.js'
import Category from '../models/Category.js'

export const getAllSubcategories = async (req, res, next) => {
  try {
    const { categoryId } = req.query
    const filter = categoryId ? { categoryId } : {}

    const subcategories = await Subcategory.find(filter)

    res.json({ success: true, data: subcategories })
  } catch (error) {
    next(error)
  }
}

export const getSubcategoryById = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id)

    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' })
    }

    res.json({ success: true, data: subcategory })
  } catch (error) {
    next(error)
  }
}

export const createSubcategory = async (req, res, next) => {
  try {
    const { name, categoryId } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Subcategory name is required' })
    }

    if (!categoryId) {
      return res.status(400).json({ success: false, message: 'Category ID is required' })
    }

    const categoryExists = await Category.findById(categoryId)
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }

    const subcategory = await Subcategory.create({
      name: name.trim(),
      categoryId,
    })

    const populated = await Subcategory.findById(subcategory._id).populate('categoryId', 'name')

    res.status(201).json({ success: true, data: populated })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory with this name already exists in this category',
      })
    }
    next(error)
  }
}

export const updateSubcategory = async (req, res, next) => {
  try {
    const { name, categoryId } = req.body
    const updateData = {}

    if (name) updateData.name = name.trim()

    if (categoryId) {
      const categoryExists = await Category.findById(categoryId)
      if (!categoryExists) {
        return res.status(404).json({ success: false, message: 'Category not found' })
      }
      updateData.categoryId = categoryId
    }

    const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('categoryId', 'name')

    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' })
    }

    res.json({ success: true, data: subcategory })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory with this name already exists in this category',
      })
    }
    next(error)
  }
}

export const deleteSubcategory = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id)
    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' })
    }
    res.json({ success: true, message: 'Subcategory deleted successfully' })
  } catch (error) {
    next(error)
  }
}
