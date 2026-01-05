import mongoose from 'mongoose'

const specSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Specification name is required'],
      trim: true,
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: [true, 'Subcategory ID is required'],
    },
  },
  {
    timestamps: true,
  },
)

// Ensure unique spec name within a subcategory
specSchema.index({ name: 1, subcategoryId: 1 }, { unique: true })

const Spec = mongoose.model('Spec', specSchema)

export default Spec
