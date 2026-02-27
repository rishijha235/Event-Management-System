# Event Management System - Backend

Complete backend for the Event Management System built with Node.js and Express.

## Quick Start

### Installation
```bash
npm install
```

### Environment Setup
Create `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

### Run Server
```bash
npm start          # Production mode
npm run dev        # Development mode with auto-reload
```

## Database Setup

### MongoDB Local Setup
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your connection string
```

## API Documentation

See main README.md in root directory for complete API documentation.

## Folder Structure

```
server/
├── config/           # Database and configuration
├── controllers/      # Business logic handlers
├── models/          # MongoDB schemas
├── routes/          # API endpoints
├── middleware/      # Auth, error handling
├── utils/           # Helper functions
├── server.js        # Main entry point
├── package.json
└── .env
```

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cookie-parser** - Cookie parsing
- **cors** - Cross-origin support
- **dotenv** - Environment variables
- **express-validator** - Input validation

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/event-management |
| JWT_SECRET | JWT signing secret | your_secret_key |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |

## Health Check

Server health endpoint:
```
GET /health
```

Returns:
```json
{
  "success": true,
  "message": "Server is running"
}
```

## Error Handling

All errors return JSON response:
```json
{
  "success": false,
  "message": "Error description"
}
```

## CORS Configuration

Frontend URL: `http://localhost:3000`

Modify in server.js if using different frontend URL.
