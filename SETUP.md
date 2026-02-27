# Complete Setup Guide

This guide will help you set up and run the Event Management System.

## Prerequisites

- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- npm (comes with Node.js)
- MongoDB (local or Atlas) - [Download Local](https://www.mongodb.com/try/download/community) or [Atlas Cloud](https://www.mongodb.com/cloud/atlas)

## Step 1: MongoDB Setup

### Option A: Local MongoDB
1. Download and install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS (if installed via Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/event-management`)

## Step 2: Backend Setup

### 2.1 Navigate to Server Directory
```bash
cd "C:\Users\RISHI\Desktop\management system\event-management\server"
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Create .env File
Create a file named `.env` in the server folder with:

**For Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/event-management
JWT_SECRET=event_management_secret_key_2024_change_in_production
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/event-management
JWT_SECRET=event_management_secret_key_2024_change_in_production
PORT=5000
NODE_ENV=development
```

### 2.4 Start Backend Server
```bash
npm start
```

or for development with auto-reload:
```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

## Step 3: Frontend Setup

### 3.1 Open New Terminal and Navigate to Client Directory
```bash
cd "C:\Users\RISHI\Desktop\management system\event-management\client"
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Start Frontend Server
```bash
npm run dev
```

You should see:
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:3000/
```

## Step 4: Access the Application

1. Open browser and go to: `http://localhost:3000/`
2. You should see the Event Management System homepage

## Testing the Application

### Admin Flow
1. Click "Admin Signup" on homepage
2. Fill in details:
   - Name: Admin User
   - Email: admin@test.com
   - Password: 123456
   - Category: Event Management
3. Click Signup → Redirected to Admin Dashboard
4. Options available:
   - Maintain Users
   - Maintain Vendors
   - Membership

### Create Test Vendor (as Admin)
1. From Admin Dashboard, go to "Maintain Vendors"
2. Click "Add New Vendor"
3. Fill in details:
   - Name: Catering Co
   - Email: catering@test.com
   - Password: 123456
   - Category: Catering
   - Address: 123 Main St
   - Phone: 9999999999
4. Click Submit

### User Flow
1. Click "User Signup" on homepage
2. Fill in details:
   - Name: Test User
   - Email: user@test.com
   - Password: 123456
3. Click Signup → Redirected to User Dashboard
4. Click "Vendors" → Select Category "Catering"
5. Select the vendor you created
6. Click "View Products"

### Vendor Flow
1. Click "Vendor Login"
2. Use vendor credentials you created:
   - Email: catering@test.com
   - Password: 123456
3. From Dashboard, click "Add New Item"
4. Add a product:
   - Product Name: Vegetarian Menu
   - Price: 5000
   - Image URL: (optional)
5. Click "Add Product"

### User Shopping Flow
1. Login as User
2. Go to Vendors → Select Category → Select Vendor
3. Click "Add to Cart" on products
4. Go to Cart and review items
5. Click "Proceed to Checkout"
6. Fill shipping details
7. Select payment method
8. Click "Place Order"
9. See success page
10. Go to "Order Status" to track order

## Important Endpoints

| Feature | URL |
|---------|-----|
| Home | http://localhost:3000 |
| Admin Login | http://localhost:3000/admin/login |
| User Login | http://localhost:3000/user/login |
| Vendor Login | http://localhost:3000/vendor/login |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/health |

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- For Atlas, whitelist your IP address

### Module Not Found
```bash
# Delete node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### CORS Error
- Ensure backend is running
- Check API URL in src/services/api.js
- Check CORS configuration in server.js

## Database Initialization

The database collections are created automatically when you:
1. Create an admin account (creates Admins collection)
2. Create a user account (creates Users collection)
3. Add a vendor (creates Vendors collection)
4. Add a product (creates Products collection)
5. Create an order (creates Orders collection)
6. Add membership (creates Memberships collection)

## Default Admin Test Credentials

After first signup, use these credentials:
- Email: admin@test.com
- Password: 123456

## Production Deployment

For production deployment:

1. Update JWT_SECRET in .env
2. Set NODE_ENV=production
3. Enable HTTPS
4. Use MongoDB Atlas for database
5. Deploy backend to service like Heroku, Vercel, Railway
6. Deploy frontend to service like Netlify, Vercel
7. Update API base URL in frontend

## Additional Commands

### Backend
```bash
npm start     # Production mode
npm run dev   # Development with nodemon
```

### Frontend
```bash
npm run dev       # Development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## File Structure Check

After setup, your structure should be:
```
event-management/
├── client/
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   ├── .env
│   ├── package.json
│   └── README.md
└── README.md
```

## Support

If you encounter any issues:
1. Check the console for error messages
2. Review the README files in client/ and server/ folders
3. Ensure all prerequisites are installed
4. Verify MongoDB is running
5. Clear cache and reinstall packages if needed

## Next Steps

- Customize styling in client/src/styles/index.css
- Add more categories in models
- Implement payment gateway
- Add email notifications
- Deploy to production
