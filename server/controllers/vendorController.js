const Vendor = require('../models/Vendor');
const generateToken = require('../utils/generateToken');

// Vendor Login
exports.vendorLogin = async (req, res) => {
  try {
    const { email, userId, password } = req.body;
    const loginEmail = email || userId;

    if (!loginEmail || !password) {
      return res.status(400).json({ success: false, message: 'User Id and password are required' });
    }

    const vendor = await Vendor.findOne({ email: loginEmail }).select('+password');
    if (!vendor) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await vendor.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(vendor._id, vendor.email, vendor.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      vendor: { id: vendor._id, name: vendor.name, email: vendor.email, role: vendor.role, category: vendor.category },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().select('-password');
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get vendors by category
exports.getVendorsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const vendors = await Vendor.find({ category, status: 'Active' }).select('-password');
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Vendor (Admin)
exports.addVendor = async (req, res) => {
  try {
    const { name, email, password, category, address, phone } = req.body;

    if (!name || !email || !password || !category || !address || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const vendor = new Vendor({ name, email, password, category, address, phone });
    await vendor.save();

    res.status(201).json({
      success: true,
      message: 'Vendor added successfully',
      vendor: { id: vendor._id, name: vendor.name, email: vendor.email, category: vendor.category },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Vendor (Admin)
exports.updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, category, address, phone, status } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { name, email, category, address, phone, status },
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.status(200).json({ success: true, message: 'Vendor updated successfully', vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Vendor (Admin)
exports.deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findByIdAndDelete(id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.status(200).json({ success: true, message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id).select('-password');
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    res.status(200).json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Vendor Profile
exports.getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.id).populate('membership');
    res.status(200).json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Vendor Dashboard Data
exports.getVendorDashboard = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.id).select('name email category status');
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    res.status(200).json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
