const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: 0,
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Out of Stock'],
      default: 'Available',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
