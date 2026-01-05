import Spec from '../models/Spec.js'
import Subcategory from '../models/Subcategory.js'

export const getAllSpecs = async (req, res, next) => {
  try {
    const { subcategoryId } = req.query
    const filter = subcategoryId ? { subcategoryId } : {}

    const specs = await Spec.find(filter)

    res.json({ success: true, data: specs })
  } catch (error) {
    next(error)
  }
}

export const getSpecById = async (req, res, next) => {
  try {
    const spec = await Spec.findById(req.params.id)

    if (!spec) {
      return res.status(404).json({ success: false, message: 'Specification not found' })
    }

    res.json({ success: true, data: spec })
  } catch (error) {
    next(error)
  }
}

export const createSpec = async (req, res, next) => {
  try {
    const { name, subcategoryId } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Specification name is required' })
    }

    if (!subcategoryId) {
      return res.status(400).json({ success: false, message: 'Subcategory ID is required' })
    }

    const subcategoryExists = await Subcategory.findById(subcategoryId)
    if (!subcategoryExists) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' })
    }

    const spec = await Spec.create({ name: name.trim(), subcategoryId })

    const populated = await Spec.findById(spec._id).populate('subcategoryId', 'name')

    res.status(201).json({ success: true, data: populated })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Specification with this name already exists in this subcategory',
      })
    }
    next(error)
  }
}

export const updateSpec = async (req, res, next) => {
  try {
    const { name, subcategoryId } = req.body
    const updateData = {}

    if (name) updateData.name = name.trim()

    if (subcategoryId) {
      const subcategoryExists = await Subcategory.findById(subcategoryId)
      if (!subcategoryExists) {
        return res.status(404).json({ success: false, message: 'Subcategory not found' })
      }
      updateData.subcategoryId = subcategoryId
    }

    const spec = await Spec.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('subcategoryId', 'name')

    if (!spec) {
      return res.status(404).json({ success: false, message: 'Specification not found' })
    }

    res.json({ success: true, data: spec })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Specification with this name already exists in this subcategory',
      })
    }
    next(error)
  }
}

export const deleteSpec = async (req, res, next) => {
  try {
    const spec = await Spec.findByIdAndDelete(req.params.id)
    if (!spec) {
      return res.status(404).json({ success: false, message: 'Specification not found' })
    }
    res.json({ success: true, message: 'Specification deleted successfully' })
  } catch (error) {
    next(error)
  }
}
