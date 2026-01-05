import express from 'express'
import {
  getAllSpecs,
  getSpecById,
  createSpec,
  updateSpec,
  deleteSpec,
} from '../controllers/specController.js'

const router = express.Router()

router.get('/', getAllSpecs)
router.get('/:id', getSpecById)
router.post('/', createSpec)
router.put('/:id', updateSpec)
router.delete('/:id', deleteSpec)

export default router
