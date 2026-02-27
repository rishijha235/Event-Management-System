const Guest = require('../models/Guest');

exports.getGuests = async (req, res) => {
  try {
    const guests = await Guest.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, guests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addGuest = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const guest = await Guest.create({
      user: req.user.id,
      name,
      email,
      phone,
    });

    res.status(201).json({ success: true, message: 'Guest added successfully', guest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const guest = await Guest.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { name, email, phone },
      { new: true, runValidators: true }
    );

    if (!guest) {
      return res.status(404).json({ success: false, message: 'Guest not found' });
    }

    res.status(200).json({ success: true, message: 'Guest updated successfully', guest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteGuest = async (req, res) => {
  try {
    const { id } = req.params;

    const guest = await Guest.findOneAndDelete({ _id: id, user: req.user.id });

    if (!guest) {
      return res.status(404).json({ success: false, message: 'Guest not found' });
    }

    res.status(200).json({ success: true, message: 'Guest deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
