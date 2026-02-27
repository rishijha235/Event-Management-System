const RequestItem = require('../models/RequestItem');

const buildImageUrl = (req, filePath) => {
  if (!filePath) return '';
  const normalizedPath = filePath.replace(/\\/g, '/');
  return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
};

exports.createRequestItem = async (req, res) => {
  try {
    const { itemName } = req.body;

    if (!itemName) {
      return res.status(400).json({ success: false, message: 'Item name is required' });
    }

    const image = req.file
      ? buildImageUrl(req, `uploads/requests/${req.file.filename}`)
      : '';

    const requestItem = new RequestItem({
      user: req.user.id,
      itemName,
      image,
      status: 'Requested',
    });

    await requestItem.save();

    res.status(201).json({
      success: true,
      message: 'Request item created successfully',
      requestItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserRequestItems = async (req, res) => {
  try {
    const requestItems = await RequestItem.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, requestItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllRequestItems = async (req, res) => {
  try {
    const requestItems = await RequestItem.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    res.status(200).json({ success: true, requestItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
