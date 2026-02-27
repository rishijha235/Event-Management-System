@echo off
REM Event Management System - Setup Script

echo ============================================
echo Event Management System - Setup Script
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    echo Please download from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js detected
node --version
echo.

REM Navigate to server directory
echo ============================================
echo Setting up BACKEND
echo ============================================
echo.

cd server
if errorlevel 1 (
    echo ERROR: Could not find server folder
    pause
    exit /b 1
)

echo Installing backend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Backend installation failed
    pause
    exit /b 1
)

echo ✓ Backend dependencies installed
echo.

REM Navigate to client directory
cd ..
echo ============================================
echo Setting up FRONTEND
echo ============================================
echo.

cd client
if errorlevel 1 (
    echo ERROR: Could not find client folder
    pause
    exit /b 1
)

echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Frontend installation failed
    pause
    exit /b 1
)

echo ✓ Frontend dependencies installed
echo.

cd ..

echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo NEXT STEPS:
echo.
echo 1. Configure MongoDB:
echo    - Local: Start MongoDB service
echo    - Cloud: Get Atlas connection string
echo.
echo 2. Configure Backend:
echo    - Edit server/.env file
echo    - Add MONGODB_URI
echo    - Add JWT_SECRET
echo.
echo 3. Start Backend:
echo    - Open Terminal in server folder
echo    - Run: npm start
echo.
echo 4. Start Frontend:
echo    - Open New Terminal in client folder
echo    - Run: npm run dev
echo.
echo 5. Open Browser:
echo    - Go to http://localhost:3000
echo.
echo See SETUP.md for detailed instructions
echo ============================================
echo.

pause
