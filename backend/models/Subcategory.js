import mongoose from 'mongoose'

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subcategory name is required'],
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required'],
    },
  },
  {
    timestamps: true,
  },
)

// Ensure unique subcategory name within a category
subcategorySchema.index({ name: 1, categoryId: 1 }, { unique: true })

const Subcategory = mongoose.model('Subcategory', subcategorySchema)

export default Subcategory
