const Membership = require('../models/Membership');
const Vendor = require('../models/Vendor');
const User = require('../models/User');
const generateMembershipNumber = require('../utils/membershipUtils');

// Calculate end date based on duration
const calculateEndDate = (duration) => {
  const startDate = new Date();
  const endDate = new Date();

  switch (duration) {
    case '6 months':
      endDate.setMonth(endDate.getMonth() + 6);
      break;
    case '1 year':
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
    case '2 years':
      endDate.setFullYear(endDate.getFullYear() + 2);
      break;
    default:
      endDate.setMonth(endDate.getMonth() + 6);
  }

  return endDate;
};

// Get membership cost
const getMembershipCost = (duration) => {
  const costs = {
    '6 months': 5000,
    '1 year': 9000,
    '2 years': 16000,
  };
  return costs[duration] || 5000;
};

// Add Membership
exports.addMembership = async (req, res) => {
  try {
    const { userId, vendorId, duration } = req.body;

    if (!userId && !vendorId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    let targetUser = null;
    let targetVendor = null;

    if (userId) {
      targetUser = await User.findById(userId);
      if (!targetUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
    } else if (vendorId) {
      targetVendor = await Vendor.findById(vendorId);
      if (!targetVendor) {
        return res.status(404).json({ success: false, message: 'Vendor not found' });
      }
    }

    const membershipNumber = generateMembershipNumber();
    const endDate = calculateEndDate(duration);
    const cost = getMembershipCost(duration);

    const membership = new Membership({
      membershipNumber,
      user: userId || null,
      vendor: vendorId || null,
      duration,
      endDate,
      cost,
      status: 'Active',
      features: ['Product Listing', 'Order Management', 'Analytics'],
    });

    await membership.save();
    if (targetUser) {
      targetUser.membership = membership._id;
      await targetUser.save();
    }
    if (targetVendor) {
      targetVendor.membership = membership._id;
      await targetVendor.save();
    }

    res.status(201).json({
      success: true,
      message: 'Membership added successfully',
      membership,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Membership
exports.updateMembership = async (req, res) => {
  try {
    const { membershipNumber } = req.params;
    const { duration, status } = req.body;

    if (!membershipNumber) {
      return res.status(400).json({ success: false, message: 'Membership number is required' });
    }

    const membership = await Membership.findOne({ membershipNumber });
    if (!membership) {
      return res.status(404).json({ success: false, message: 'Membership not found' });
    }

    if (duration) {
      membership.duration = duration;
      membership.endDate = calculateEndDate(duration);
      membership.cost = getMembershipCost(duration);
    }

    if (status) {
      membership.status = status;
    }

    await membership.save();

    res.status(200).json({
      success: true,
      message: 'Membership updated successfully',
      membership,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Membership Details
exports.getMembershipDetails = async (req, res) => {
  try {
    const { membershipNumber } = req.params;

    const membership = await Membership.findOne({ membershipNumber })
      .populate('user', 'name email')
      .populate('vendor', 'name email category');
    if (!membership) {
      return res.status(404).json({ success: false, message: 'Membership not found' });
    }

    res.status(200).json({ success: true, membership });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Extend Membership
exports.extendMembership = async (req, res) => {
  try {
    const { membershipNumber, duration } = req.body;

    if (!membershipNumber) {
      return res.status(400).json({ success: false, message: 'Membership number is required' });
    }

    const membership = await Membership.findOne({ membershipNumber });
    if (!membership) {
      return res.status(404).json({ success: false, message: 'Membership not found' });
    }

    const newDuration = duration || '6 months';
    const newEndDate = calculateEndDate(newDuration);
    const additionalCost = getMembershipCost(newDuration);

    membership.duration = newDuration;
    membership.endDate = newEndDate;
    membership.cost += additionalCost;
    membership.status = 'Active';

    await membership.save();

    res.status(200).json({
      success: true,
      message: 'Membership extended successfully',
      membership,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel Membership
exports.cancelMembership = async (req, res) => {
  try {
    const { membershipNumber } = req.body;

    if (!membershipNumber) {
      return res.status(400).json({ success: false, message: 'Membership number is required' });
    }

    const membership = await Membership.findOne({ membershipNumber });
    if (!membership) {
      return res.status(404).json({ success: false, message: 'Membership not found' });
    }

    membership.status = 'Cancelled';
    await membership.save();

    const user = membership.user ? await User.findById(membership.user) : null;
    if (user) {
      user.membership = null;
      await user.save();
    }

    const vendor = membership.vendor ? await Vendor.findById(membership.vendor) : null;
    if (vendor) {
      vendor.membership = null;
      await vendor.save();
    }

    res.status(200).json({
      success: true,
      message: 'Membership cancelled successfully',
      membership,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all memberships (Admin)
exports.getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find({ user: { $ne: null } })
      .populate('user', 'name email')
      .populate('vendor', 'name email category');
    res.status(200).json({ success: true, memberships });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get vendor membership
exports.getVendorMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({ vendor: req.user.id });
    if (!membership) {
      return res.status(404).json({ success: false, message: 'No membership found' });
    }
    res.status(200).json({ success: true, membership });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Membership for Vendor (Admin)
exports.addVendorMembership = async (req, res) => {
  try {
    const { vendorId, duration } = req.body;

    if (!vendorId) {
      return res.status(400).json({ success: false, message: 'Vendor ID is required' });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    const membershipNumber = generateMembershipNumber();
    const endDate = calculateEndDate(duration);
    const cost = getMembershipCost(duration);

    const membership = new Membership({
      membershipNumber,
      vendor: vendorId,
      user: null,
      duration,
      endDate,
      cost,
      status: 'Active',
      features: ['Product Listing', 'Order Management', 'Analytics'],
    });

    await membership.save();
    vendor.membership = membership._id;
    await vendor.save();

    res.status(201).json({
      success: true,
      message: 'Vendor membership added successfully',
      membership,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Membership for Vendor (Admin)
exports.updateVendorMembership = async (req, res) => {
  try {
    const { membershipNumber } = req.params;
    const { duration, status } = req.body;

    const membership = await Membership.findOne({ membershipNumber, vendor: { $ne: null } });
    if (!membership) {
      return res.status(404).json({ success: false, message: 'Vendor membership not found' });
    }

    if (duration) {
      membership.duration = duration;
      membership.endDate = calculateEndDate(duration);
      membership.cost = getMembershipCost(duration);
    }

    if (status) {
      membership.status = status;
    }

    await membership.save();

    if (status === 'Cancelled' && membership.vendor) {
      const vendor = await Vendor.findById(membership.vendor);
      if (vendor) {
        vendor.membership = null;
        await vendor.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Vendor membership updated successfully',
      membership,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all vendor memberships (Admin)
exports.getAllVendorMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find({ vendor: { $ne: null } })
      .populate('vendor', 'name email category');
    res.status(200).json({ success: true, memberships });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
