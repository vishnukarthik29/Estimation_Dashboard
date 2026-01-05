import express from 'express'
import {
  getAllSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from '../controllers/subcategoryController.js'

const router = express.Router()

router.get('/', getAllSubcategories)
router.get('/:id', getSubcategoryById)
router.post('/', createSubcategory)
router.put('/:id', updateSubcategory)
router.delete('/:id', deleteSubcategory)

export default router
