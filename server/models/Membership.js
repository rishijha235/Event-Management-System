const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    membershipNumber: {
      type: String,
      unique: true,
      required: [true, 'Membership number is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      default: null,
    },
    duration: {
      type: String,
      enum: ['6 months', '1 year', '2 years'],
      required: [true, 'Please select a duration'],
      default: '6 months',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    features: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Cancelled'],
      default: 'Active',
    },
    cost: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

membershipSchema.pre('validate', function (next) {
  if (!this.user && !this.vendor) {
    return next(new Error('Either user or vendor is required for membership'));
  }
  next();
});

module.exports = mongoose.model('Membership', membershipSchema);
