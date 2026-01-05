import express from 'express'
import {
  getAllCalculations,
  getCalculationById,
  createCalculation,
  updateCalculation,
  deleteCalculation,
} from '../controllers/calculationController.js'

const router = express.Router()

router.get('/', getAllCalculations)
router.get('/:id', getCalculationById)
router.post('/', createCalculation)
router.put('/:id', updateCalculation)
router.delete('/:id', deleteCalculation)

export default router
