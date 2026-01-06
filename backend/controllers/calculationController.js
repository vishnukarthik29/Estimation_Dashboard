import Calculation from '../models/Calculation.js'

export const getAllCalculations = async (req, res, next) => {
  try {
    const { categoryId, subcategoryId, specId } = req.query
    const filter = {}

    if (categoryId) filter.categoryId = categoryId
    if (subcategoryId) filter.subcategoryId = subcategoryId
    if (specId) filter.specId = specId

    const calculations = await Calculation.find(filter)

    res.json({ success: true, data: calculations })
  } catch (error) {
    next(error)
  }
}

export const getCalculationById = async (req, res, next) => {
  try {
    const calculation = await Calculation.findById(req.params.id)

    if (!calculation) {
      return res.status(404).json({ success: false, message: 'Calculation not found' })
    }

    res.json({ success: true, data: calculation })
  } catch (error) {
    next(error)
  }
}

// export const createCalculation = async (req, res, next) => {
//   try {
//     const {
//       categoryId,
//       subcategoryId,
//       specId,
//       type,
//       materialCalculationMode,
//       manualMaterialAmount,
//       materialLines,
//       labourAmount,
//       transportAmount,
//       pmcSafetyPercentage,
//       notes,
//     } = req.body

//     if (!categoryId || !subcategoryId || !specId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Category, Subcategory, and Spec are required',
//       })
//     }

//     const processedMaterialLines = (materialLines || []).map((line) => ({
//       ...line,
//       amount: line.quantity * line.rate,
//     }))

//     let totalMaterialAmount =
//       materialCalculationMode === 'manual'
//         ? manualMaterialAmount || 0
//         : processedMaterialLines.reduce((sum, l) => sum + l.amount, 0)

//     const subtotalForPMC = totalMaterialAmount + (labourAmount || 0) + (transportAmount || 0)

//     const pmcSafetyAmount = (subtotalForPMC * (pmcSafetyPercentage || 0)) / 100
//     const grandTotal = subtotalForPMC + pmcSafetyAmount

//     const calculation = await Calculation.create({
//       categoryId,
//       subcategoryId,
//       specId,
//       type: type || 'material',
//       materialCalculationMode: materialCalculationMode || 'calculated',
//       manualMaterialAmount: manualMaterialAmount || 0,
//       materialLines: processedMaterialLines,
//       totalMaterialAmount,
//       labourAmount: labourAmount || 0,
//       transportAmount: transportAmount || 0,
//       pmcSafetyPercentage: pmcSafetyPercentage || 0,
//       subtotalForPMC,
//       pmcSafetyAmount,
//       grandTotal,
//       notes,
//     })

//     const populated = await Calculation.findById(calculation._id)
//       .populate('categoryId', 'name')
//       .populate('subcategoryId', 'name')
//       .populate('specId', 'name')

//     res.status(201).json({ success: true, data: populated })
//   } catch (error) {
//     next(error)
//   }
// }
export const createCalculation = async (req, res, next) => {
  try {
    const {
      categoryId,
      subcategoryId,
      specId,
      type,
      materialCalculationMode,
      manualMaterialAmount,
      materialLines,
      labourCalculationMode,
      manualLabourAmount,
      labourLines,
      transportAmount,
      pmcSafetyPercentage,
      notes,
    } = req.body

    // Validate required fields
    if (!categoryId || !subcategoryId || !specId) {
      return res.status(400).json({
        success: false,
        message: 'Category, Subcategory, and Spec are required',
      })
    }

    // Process Material Lines
    const processedMaterialLines = (materialLines || []).map((line) => ({
      ...line,
      amount: (line.quantity || 0) * (line.rate || 0),
    }))

    // Calculate Total Material Amount
    let totalMaterialAmount = 0
    if (materialCalculationMode === 'manual') {
      totalMaterialAmount = manualMaterialAmount || 0
    } else {
      totalMaterialAmount = processedMaterialLines.reduce((sum, line) => sum + line.amount, 0)
    }

    // Process Labour Lines
    const processedLabourLines = (labourLines || []).map((line) => ({
      ...line,
      amount: (line.quantity || 0) * (line.rate || 0),
    }))

    // Calculate Total Labour Amount
    let totalLabourAmount = 0
    if (labourCalculationMode === 'manual') {
      totalLabourAmount = manualLabourAmount || 0
    } else {
      totalLabourAmount = processedLabourLines.reduce((sum, line) => sum + line.amount, 0)
    }

    // Calculate Subtotal (Material + Labour + Transport)
    const subtotalForPMC = totalMaterialAmount + totalLabourAmount + (transportAmount || 0)

    // Calculate PMC Safety Amount
    const pmcSafetyAmount = (subtotalForPMC * (pmcSafetyPercentage || 0)) / 100

    // Calculate Grand Total
    const grandTotal = subtotalForPMC + pmcSafetyAmount

    // Create Calculation Document
    const calculation = await Calculation.create({
      categoryId,
      subcategoryId,
      specId,
      type: type || 'material',

      // Material fields
      materialCalculationMode: materialCalculationMode || 'calculated',
      manualMaterialAmount: manualMaterialAmount || 0,
      materialLines: processedMaterialLines,
      totalMaterialAmount,

      // Labour fields
      labourCalculationMode: labourCalculationMode || 'calculated',
      manualLabourAmount: manualLabourAmount || 0,
      labourLines: processedLabourLines,
      totalLabourAmount,

      // Other costs
      transportAmount: transportAmount || 0,
      pmcSafetyPercentage: pmcSafetyPercentage || 0,

      // Calculated totals
      subtotalForPMC,
      pmcSafetyAmount,
      grandTotal,

      // Optional notes
      notes,
    })

    // Populate references and return
    const populated = await Calculation.findById(calculation._id)
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name')
      .populate('specId', 'name')

    res.status(201).json({
      success: true,
      data: populated,
      message: 'Calculation created successfully',
    })
  } catch (error) {
    console.error('Error creating calculation:', error)
    next(error)
  }
}

export const updateCalculation = async (req, res, next) => {
  try {
    const {
      materialCalculationMode,
      manualMaterialAmount,
      materialLines,
      labourAmount,
      transportAmount,
      pmcSafetyPercentage,
      notes,
    } = req.body

    const existing = await Calculation.findById(req.params.id)
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Calculation not found' })
    }

    let processedMaterialLines
    if (materialLines) {
      processedMaterialLines = materialLines.map((line) => ({
        ...line,
        amount: line.quantity * line.rate,
      }))
    }

    let totalMaterialAmount = existing.totalMaterialAmount
    if (materialCalculationMode === 'manual') {
      totalMaterialAmount = manualMaterialAmount ?? existing.manualMaterialAmount
    } else if (processedMaterialLines) {
      totalMaterialAmount = processedMaterialLines.reduce((s, l) => s + l.amount, 0)
    }

    const subtotalForPMC =
      totalMaterialAmount +
      (labourAmount ?? existing.labourAmount) +
      (transportAmount ?? existing.transportAmount)

    const pmcPercent = pmcSafetyPercentage ?? existing.pmcSafetyPercentage
    const pmcSafetyAmount = (subtotalForPMC * pmcPercent) / 100
    const grandTotal = subtotalForPMC + pmcSafetyAmount

    const calculation = await Calculation.findByIdAndUpdate(
      req.params.id,
      {
        ...(materialCalculationMode && { materialCalculationMode }),
        ...(manualMaterialAmount !== undefined && { manualMaterialAmount }),
        ...(processedMaterialLines && { materialLines: processedMaterialLines }),
        totalMaterialAmount,
        ...(labourAmount !== undefined && { labourAmount }),
        ...(transportAmount !== undefined && { transportAmount }),
        ...(pmcSafetyPercentage !== undefined && { pmcSafetyPercentage }),
        subtotalForPMC,
        pmcSafetyAmount,
        grandTotal,
        ...(notes !== undefined && { notes }),
      },
      { new: true, runValidators: true },
    )
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name')
      .populate('specId', 'name')

    res.json({ success: true, data: calculation })
  } catch (error) {
    next(error)
  }
}

export const deleteCalculation = async (req, res, next) => {
  try {
    const calculation = await Calculation.findByIdAndDelete(req.params.id)
    if (!calculation) {
      return res.status(404).json({ success: false, message: 'Calculation not found' })
    }
    res.json({ success: true, message: 'Calculation deleted successfully' })
  } catch (error) {
    next(error)
  }
}
