const Order = require('../models/Order');

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { vendor, products, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!vendor || !products || !totalAmount || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one product is required' });
    }

    const hasInvalidLine = products.some(
      (line) => !line.product || !line.quantity || !line.price || line.quantity < 1 || line.price < 0
    );
    if (hasInvalidLine) {
      return res.status(400).json({ success: false, message: 'Invalid product line items' });
    }

    const order = new Order({
      user: req.user.id,
      vendor,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'Received',
    });

    await order.save();
    res.status(201).json({ success: true, message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('vendor', 'name category')
      .populate('products.product', 'name price');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Vendor Orders
exports.getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user.id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('products.product', 'name price image');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Order Status (Vendor)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Received', 'Ready for Shipping', 'Out for Delivery', 'Delivered'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('vendor', 'name category')
      .populate('products.product', 'name price');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('vendor', 'name category')
      .populate('products.product', 'name price');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
