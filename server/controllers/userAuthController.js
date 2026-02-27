const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// User Signup
exports.userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user._id, user.email, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User Login
exports.userLogin = async (req, res) => {
  try {
    const { email, userId, password } = req.body;
    const loginEmail = email || userId;

    if (!loginEmail || !password) {
      return res.status(400).json({ success: false, message: 'User Id and password are required' });
    }

    const user = await User.findOne({ email: loginEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.email, user.role);

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
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, address, city, state, pinCode, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, address, city, state, pinCode, phone },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
