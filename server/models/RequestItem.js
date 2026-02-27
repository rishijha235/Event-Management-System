const mongoose = require('mongoose');

const requestItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Requested', 'Reviewed', 'Closed'],
      default: 'Requested',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RequestItem', requestItemSchema);
