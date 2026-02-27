# Event Management System

A complete full-stack Event Management System built with React.js, Node.js, Express, and MongoDB.

## Features

### Admin Module
- Signup and Login with secure authentication
- Maintain Users (Add, Update, Delete)
- Maintain Vendors (Add, Update, Delete)
- Membership Management (Add, Extend, Cancel)

### Vendor Module
- Vendor Login
- Add and Manage Products
- View and Update Order Status
- Access to Membership information

### User Module
- User Signup and Login
- Browse Vendors by Category (Catering, Florist, Decoration, Lighting)
- View Products and Add to Cart
- Checkout with Shipping Details
- Payment Method Selection (Cash/UPI)
- Track Order Status in Real-time

## Tech Stack

### Frontend
- **React.js** - UI Library
- **Vite** - Build Tool
- **Axios** - HTTP Client
- **React Router** - Routing
- **Context API** - State Management
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing

## Project Structure

```
event-management/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service
│   │   ├── context/        # Auth and Cart context
│   │   ├── styles/         # CSS styles
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                 # Node.js Backend
    ├── config/            # Database configuration
    ├── controllers/       # Business logic
    ├── models/           # Database schemas
    ├── routes/           # API routes
    ├── middleware/       # Authentication middleware
    ├── utils/            # Utility functions
    ├── server.js
    ├── .env
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (.env):**
   ```
   MONGODB_URI=mongodb://localhost:27017/event-management
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the server:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Open new terminal and navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/admin/signup` - Admin Registration
- `POST /api/auth/admin/login` - Admin Login
- `POST /api/auth/user/signup` - User Registration
- `POST /api/auth/user/login` - User Login
- `POST /api/vendor/login` - Vendor Login
- `POST /api/logout` - Logout

### Admin User Management
- `GET /api/users` - Get all users
- `POST /api/users` - Add user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Vendor Management
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/category/:category` - Get vendors by category
- `POST /api/vendors` - Add vendor (Admin)
- `PUT /api/vendors/:id` - Update vendor (Admin)
- `DELETE /api/vendors/:id` - Delete vendor (Admin)

### Product Management
- `POST /api/products` - Add product (Vendor)
- `GET /api/vendor/products` - Get vendor's products
- `GET /api/products/vendor/:vendorId` - Get products by vendor
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Order Management
- `POST /api/orders` - Create order (User)
- `GET /api/user/orders` - Get user's orders
- `GET /api/vendor/orders` - Get vendor's orders
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders` - Get all orders (Admin)

### Membership
- `POST /api/memberships` - Add membership (Admin)
- `GET /api/memberships` - Get all memberships
- `PUT /api/memberships/extend` - Extend membership
- `PUT /api/memberships/cancel` - Cancel membership

## Usage

### Admin Flow
1. Signup/Login as Admin
2. Dashboard shows options for:
   - Managing Users
   - Managing Vendors
   - Managing Memberships
3. Can add, update, or delete users and vendors
4. Can add memberships to vendors with duration options

### Vendor Flow
1. Admin adds vendor account
2. Vendor logs in
3. Can add products with details (name, price, image)
4. Can manage products (update, delete)
5. Can view and update order statuses

### User Flow
1. Signup/Login as User
2. Browse vendors by selecting categories
3. View products from selected vendors
4. Add products to cart
5. Proceed to checkout
6. Enter shipping details and select payment method
7. Place order
8. Track order status

## Key Features

✅ **Role-Based Access Control** - Different features for Admin, Vendor, User
✅ **JWT Authentication** - Secure token-based authentication
✅ **Password Hashing** - bcrypt for secure password storage
✅ **Session Management** - Persistent login with localStorage
✅ **Form Validation** - All forms have proper validation
✅ **Error Handling** - Comprehensive error messages
✅ **Responsive Design** - Works on desktop and mobile
✅ **Real-time Status Updates** - Order status updates reflect immediately
✅ **Cart Management** - Add, remove, update quantities
✅ **Order Tracking** - Users can track their orders

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes with middleware
- Role-based authorization
- CORS configuration
- HttpOnly cookies support
- Input validation on all endpoints

## Testing

### Test Admin Account
Create a new admin account through signup or use:
- Email: admin@test.com
- Password: 123456

### Test User Account
Create a new user account or use:
- Email: user@test.com
- Password: 123456

### Test Vendor Account
Admin can create vendor accounts with all categories

## Database Schema

### Users Collection
- name, email, password (hashed)
- address, city, state, pinCode, phone
- role, timestamps

### Vendors Collection
- name, email, password (hashed)
- category, address, phone, status
- membership reference
- role, timestamps

### Products Collection
- name, price, image, description
- vendor reference
- status, timestamps

### Orders Collection
- user reference, vendor reference
- products array (product, quantity, price)
- totalAmount, shippingAddress
- paymentMethod, status, timestamps

### Memberships Collection
- membershipNumber (unique)
- vendor reference
- duration (6 months, 1 year, 2 years)
- startDate, endDate, cost
- features, status, timestamps

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running
- Check if backend is running on port 5000
- Check if frontend is running on port 3000

### CORS Errors
- Ensure backend CORS is configured for http://localhost:3000
- Check browser console for specific errors

### Authentication Issues
- Clear localStorage and cookies
- Try logging out and logging back in
- Check JWT_SECRET in .env file

## Future Enhancements

- Payment gateway integration (Stripe, Razorpay)
- Email notifications
- Admin dashboard with analytics
- Product reviews and ratings
- Wishlist feature
- Advanced search and filters
- Promotional codes and discounts

## Support

For issues or questions, please create an issue in the repository.
