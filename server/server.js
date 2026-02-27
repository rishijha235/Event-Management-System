require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');
const userRoutes = require('./routes/userRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const guestRoutes = require('./routes/guestRoutes');
const requestItemRoutes = require('./routes/requestItemRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', userAuthRoutes);
app.use('/api', userRoutes);
app.use('/api', vendorRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', membershipRoutes);
app.use('/api', guestRoutes);
app.use('/api', requestItemRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
