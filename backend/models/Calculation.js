import mongoose from 'mongoose'

const materialLineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  uom: {
    type: String,
    required: true,
    enum: ['Kg', 'Ton', 'Bag', 'Nos', 'Sqm', 'Sqft', 'Rft', 'Cum', 'Rmt', 'Ltr'],
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
})

const labourLineSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
})

const calculationSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: true,
    },
    specId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Spec',
      required: true,
    },
    type: {
      type: String,
      enum: ['material', 'subcontractor'],
      required: true,
    },
    materialCalculationMode: {
      type: String,
      enum: ['calculated', 'manual'],
      default: 'calculated',
    },
    manualMaterialAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    materialLines: [materialLineSchema],
    totalMaterialAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    // labourAmount: {
    //   type: Number,
    //   required: true,
    //   default: 0,
    //   min: 0,
    // },
    // Add to calculationSchema:
    labourCalculationMode: {
      type: String,
      enum: ['calculated', 'manual'],
      default: 'calculated',
    },
    manualLabourAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    labourLines: [labourLineSchema],
    totalLabourAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    transportAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    pmcSafetyPercentage: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100,
    },
    subtotalForPMC: {
      type: Number,
      required: true,
    },
    pmcSafetyAmount: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

const Calculation = mongoose.model('Calculation', calculationSchema)

export default Calculation
