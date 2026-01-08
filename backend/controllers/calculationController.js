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
      .populate('categoryId')
      .populate('subcategoryId')
      .populate('specId')

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
      adminCostPercentage,
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

    // Calculate Admin Cost Amount
    const adminCostAmount = (subtotalForPMC * (adminCostPercentage || 0)) / 100

    // Calculate Grand Total
    const grandTotal = subtotalForPMC + pmcSafetyAmount + adminCostAmount

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
      adminCostPercentage: adminCostPercentage || 0,

      // Calculated totals
      subtotalForPMC,
      pmcSafetyAmount,
      adminCostAmount,
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

// export const updateCalculation = async (req, res, next) => {
//   try {
//     const {
//       materialCalculationMode,
//       manualMaterialAmount,
//       materialLines,
//       labourAmount,
//       transportAmount,
//       pmcSafetyPercentage,
//       notes,
//     } = req.body

//     const existing = await Calculation.findById(req.params.id)
//     if (!existing) {
//       return res.status(404).json({ success: false, message: 'Calculation not found' })
//     }

//     let processedMaterialLines
//     if (materialLines) {
//       processedMaterialLines = materialLines.map((line) => ({
//         ...line,
//         amount: line.quantity * line.rate,
//       }))
//     }

//     let totalMaterialAmount = existing.totalMaterialAmount
//     if (materialCalculationMode === 'manual') {
//       totalMaterialAmount = manualMaterialAmount ?? existing.manualMaterialAmount
//     } else if (processedMaterialLines) {
//       totalMaterialAmount = processedMaterialLines.reduce((s, l) => s + l.amount, 0)
//     }

//     const subtotalForPMC =
//       totalMaterialAmount +
//       (labourAmount ?? existing.labourAmount) +
//       (transportAmount ?? existing.transportAmount)

//     const pmcPercent = pmcSafetyPercentage ?? existing.pmcSafetyPercentage
//     const pmcSafetyAmount = (subtotalForPMC * pmcPercent) / 100
//     const grandTotal = subtotalForPMC + pmcSafetyAmount

//     const calculation = await Calculation.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...(materialCalculationMode && { materialCalculationMode }),
//         ...(manualMaterialAmount !== undefined && { manualMaterialAmount }),
//         ...(processedMaterialLines && { materialLines: processedMaterialLines }),
//         totalMaterialAmount,
//         ...(labourAmount !== undefined && { labourAmount }),
//         ...(transportAmount !== undefined && { transportAmount }),
//         ...(pmcSafetyPercentage !== undefined && { pmcSafetyPercentage }),
//         subtotalForPMC,
//         pmcSafetyAmount,
//         grandTotal,
//         ...(notes !== undefined && { notes }),
//       },
//       { new: true, runValidators: true },
//     )
//       .populate('categoryId', 'name')
//       .populate('subcategoryId', 'name')
//       .populate('specId', 'name')

//     res.json({ success: true, data: calculation })
//   } catch (error) {
//     next(error)
//   }
// }
// export const updateCalculation = async (req, res, next) => {
//   try {
//     const {
//       materialCalculationMode,
//       manualMaterialAmount,
//       materialLines,

//       labourCalculationMode,
//       manualLabourAmount,
//       labourLines,

//       transportAmount,
//       pmcSafetyPercentage,
//       adminCostPercentage,
//       notes,
//     } = req.body

//     const existing = await Calculation.findById(req.params.id)
//     if (!existing) {
//       return res.status(404).json({ success: false, message: 'Calculation not found' })
//     }

//     /* ---------------- MATERIAL ---------------- */
//     let processedMaterialLines = existing.materialLines
//     if (materialLines) {
//       processedMaterialLines = materialLines.map((line) => ({
//         ...line,
//         amount: (line.quantity || 0) * (line.rate || 0),
//       }))
//     }

//     let totalMaterialAmount = existing.totalMaterialAmount
//     if (materialCalculationMode === 'manual') {
//       totalMaterialAmount = manualMaterialAmount ?? existing.manualMaterialAmount
//     } else {
//       totalMaterialAmount = processedMaterialLines.reduce((s, l) => s + l.amount, 0)
//     }

//     /* ---------------- LABOUR ---------------- */
//     let processedLabourLines = existing.labourLines
//     if (labourLines) {
//       processedLabourLines = labourLines.map((line) => ({
//         ...line,
//         amount: (line.quantity || 0) * (line.rate || 0),
//       }))
//     }

//     let totalLabourAmount = existing.totalLabourAmount
//     if (labourCalculationMode === 'manual') {
//       totalLabourAmount = manualLabourAmount ?? existing.manualLabourAmount
//     } else {
//       totalLabourAmount = processedLabourLines.reduce((s, l) => s + l.amount, 0)
//     }

//     /* ---------------- TOTALS ---------------- */
//     const safeTransport = transportAmount ?? existing.transportAmount

//     const subtotalForPMC = totalMaterialAmount + totalLabourAmount + safeTransport

//     const pmcPercent = pmcSafetyPercentage ?? existing.pmcSafetyPercentage
//     const adminPercent = adminCostPercentage ?? existing.adminCostPercentage

//     const pmcSafetyAmount = (subtotalForPMC * pmcPercent) / 100
//     const adminCostAmount = (subtotalForPMC * adminPercent) / 100

//     const grandTotal = subtotalForPMC + pmcSafetyAmount + adminCostAmount

//     /* ---------------- UPDATE ---------------- */
//     const calculation = await Calculation.findByIdAndUpdate(
//       req.params.id,
//       {
//         materialCalculationMode: materialCalculationMode ?? existing.materialCalculationMode,
//         manualMaterialAmount: manualMaterialAmount ?? existing.manualMaterialAmount,
//         materialLines: processedMaterialLines,
//         totalMaterialAmount,

//         labourCalculationMode: labourCalculationMode ?? existing.labourCalculationMode,
//         manualLabourAmount: manualLabourAmount ?? existing.manualLabourAmount,
//         labourLines: processedLabourLines,
//         totalLabourAmount,

//         transportAmount: safeTransport,

//         pmcSafetyPercentage: pmcPercent,
//         adminCostPercentage: adminPercent,

//         subtotalForPMC,
//         pmcSafetyAmount,
//         adminCostAmount,
//         grandTotal,

//         ...(notes !== undefined && { notes }),
//       },
//       { new: true, runValidators: true },
//     )
//       .populate('categoryId', 'name')
//       .populate('subcategoryId', 'name')
//       .populate('specId', 'name')

//     res.json({ success: true, data: calculation })
//   } catch (error) {
//     next(error)
//   }
// }

export const updateCalculation = async (req, res, next) => {
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
      adminCostPercentage,
      notes,
    } = req.body

    const existing = await Calculation.findById(req.params.id)
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Calculation not found' })
    }

    /* ---------------- MATERIAL ---------------- */
    const processedMaterialLines = (materialLines ?? existing.materialLines).map((line) => ({
      ...line,
      amount: (line.quantity || 0) * (line.rate || 0),
    }))

    const totalMaterialAmount =
      materialCalculationMode === 'manual'
        ? (manualMaterialAmount ?? existing.manualMaterialAmount)
        : processedMaterialLines.reduce((s, l) => s + l.amount, 0)

    /* ---------------- LABOUR ---------------- */
    const processedLabourLines = (labourLines ?? existing.labourLines).map((line) => ({
      ...line,
      amount: (line.quantity || 0) * (line.rate || 0),
    }))

    const totalLabourAmount =
      labourCalculationMode === 'manual'
        ? (manualLabourAmount ?? existing.manualLabourAmount)
        : processedLabourLines.reduce((s, l) => s + l.amount, 0)

    /* ---------------- TOTALS ---------------- */
    const safeTransport = transportAmount ?? existing.transportAmount
    const subtotalForPMC = totalMaterialAmount + totalLabourAmount + safeTransport

    const pmcPercent = pmcSafetyPercentage ?? existing.pmcSafetyPercentage
    const adminPercent = adminCostPercentage ?? existing.adminCostPercentage

    const pmcSafetyAmount = (subtotalForPMC * pmcPercent) / 100
    const adminCostAmount = (subtotalForPMC * adminPercent) / 100
    const grandTotal = subtotalForPMC + pmcSafetyAmount + adminCostAmount

    /* ---------------- UPDATE ---------------- */
    const updated = await Calculation.findByIdAndUpdate(
      req.params.id,
      {
        /* ✅ CATEGORY / SPEC UPDATES */
        ...(categoryId && { categoryId }),
        ...(subcategoryId && { subcategoryId }),
        ...(specId && { specId }),
        ...(type && { type }),

        /* MATERIAL */
        materialCalculationMode: materialCalculationMode ?? existing.materialCalculationMode,
        manualMaterialAmount: manualMaterialAmount ?? existing.manualMaterialAmount,
        materialLines: processedMaterialLines,
        totalMaterialAmount,

        /* LABOUR */
        labourCalculationMode: labourCalculationMode ?? existing.labourCalculationMode,
        manualLabourAmount: manualLabourAmount ?? existing.manualLabourAmount,
        labourLines: processedLabourLines,
        totalLabourAmount,

        /* OTHER */
        transportAmount: safeTransport,
        pmcSafetyPercentage: pmcPercent,
        adminCostPercentage: adminPercent,

        subtotalForPMC,
        pmcSafetyAmount,
        adminCostAmount,
        grandTotal,

        ...(notes !== undefined && { notes }),
      },
      { new: true, runValidators: true },
    )
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name')
      .populate('specId', 'name')

    res.json({ success: true, data: updated })
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
