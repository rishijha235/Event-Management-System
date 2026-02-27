# Event Management System - Frontend

React-based frontend for the Event Management System.

## Quick Start

### Installation
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Folder Structure

```
client/
├── src/
│   ├── components/
│   │   └── common.jsx      # Reusable UI components
│   ├── pages/              # Page components
│   ├── services/
│   │   └── api.js          # API client
│   ├── context/            # Context providers
│   ├── styles/
│   │   └── index.css       # Global styles
│   ├── App.jsx             # Flowchart
│   ├── main.jsx            # Routes and App setup
│   └── index.jsx           # React DOM render
├── index.html
├── vite.config.js
└── package.json
```

## Features

### Authentication
- Admin, Vendor, User signup/login
- JWT token management
- Protected routes
- Session persistence

### Admin Dashboard
- User management (CRUD)
- Vendor management (CRUD)
- Membership management

### Vendor Dashboard
- Product management (CRUD)
- Order management
- Status updates

### User Dashboard
- Browse vendors by category
- Shopping cart
- Checkout process
- Order tracking

## API Configuration

API Base URL: `http://localhost:5000/api`

Configure in `src/services/api.js`

## Components

### common.jsx
Reusable components:
- Navbar
- FormInput, FormSelect, FormRadio, FormCheckbox
- Button
- Alert
- Card
- Loading

## Styling

Global styles in `src/styles/index.css`

Color Scheme:
- Primary: #3498db (Blue)
- Success: #27ae60 (Green)
- Danger: #e74c3c (Red)
- Secondary: #95a5a6 (Gray)

## Context Providers

### AuthContext
- User authentication state
- Token management
- Login/logout functions

### CartContext
- Shopping cart state
- Add/remove products
- Calculate totals
- Quantity management

## Dependencies

- **react** - UI library
- **react-dom** - React rendering
- **react-router-dom** - Routing
- **axios** - HTTP client

## Environment

Backend URL (in vite.config.js):
```
http://localhost:5000
```

## Build Output

Production build outputs to `dist/` folder.

## Troubleshooting

### API Connection Issues
- Check backend is running on port 5000
- Verify API base URL in api.js
- Check browser console for errors

### State Issues
- Clear localStorage: `localStorage.clear()`
- Clear cookies in DevTools

### Build Issues
- Delete `node_modules/` and `dist/`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
