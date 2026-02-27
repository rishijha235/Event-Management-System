const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// Admin Signup
exports.adminSignup = async (req, res) => {
  try {
    const { name, email, password, category } = req.body;

    if (!name || !email || !password || !category) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const admin = new Admin({ name, email, password, category });
    await admin.save();

    const token = generateToken(admin._id, admin.email, admin.role);

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, userId, password } = req.body;
    const loginEmail = email || userId;

    if (!loginEmail || !password) {
      return res.status(400).json({ success: false, message: 'User Id and password are required' });
    }

    const admin = await Admin.findOne({ email: loginEmail }).select('+password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(admin._id, admin.email, admin.role);

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
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
