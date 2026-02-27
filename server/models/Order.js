const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      name: String,
      email: String,
      address: String,
      city: String,
      state: String,
      pinCode: String,
      phone: String,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Received', 'Ready for Shipping', 'Out for Delivery', 'Delivered'],
      default: 'Received',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
