const Product = require('../models/Product');

const buildImageUrl = (req, filePath) => {
  if (!filePath) return '';
  const normalizedPath = filePath.replace(/\\/g, '/');
  return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
};

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    const image = req.file
      ? buildImageUrl(req, `uploads/products/${req.file.filename}`)
      : (req.body.image || '');

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }

    const product = new Product({
      name,
      price,
      image,
      description: '',
      vendor: req.user.id,
    });

    await product.save();
    res.status(201).json({ success: true, message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Vendor Products
exports.getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user.id });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Vendor Product Status
exports.getVendorProductStatus = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user.id }).populate('vendor', 'email address');
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Products by Vendor ID
exports.getProductsByVendorId = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const products = await Product.find({ vendor: vendorId, status: 'Available' });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image, description, status } = req.body;

    const updateData = {
      name,
      price,
      image,
      description,
      status,
    };

    if (req.file) {
      updateData.image = buildImageUrl(req, `uploads/products/${req.file.filename}`);
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('vendor');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
