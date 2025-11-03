@echo off
setlocal enabledelayedexpansion

echo ========================================
echo  Super Skull God Pro - Windows Build
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed!
    echo Please download and install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo Node.js and npm found!
echo.

echo [1/3] Installing dependencies...
echo This may take a few minutes on first run...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo.

echo [2/3] Building Windows executable...
echo This will create installer and portable versions...
call npm run build:win64
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Build failed!
    echo If you see "wine required", you need to run this on Windows.
    echo.
    pause
    exit /b 1
)
echo.

echo [3/3] Checking build output...
if exist "dist\Super Skull God Pro-1.0.0-win.zip" (
    echo SUCCESS: Build complete!
) else (
    echo WARNING: Expected output file not found, but build may have succeeded.
)
echo.

echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Your Windows build is in the "dist" folder:
echo.

if exist "dist\" (
    echo Files in dist folder:
    dir /B dist\*.exe dist\*.zip 2>nul
    echo.
)

echo To distribute your game:
echo   1. Look for the ZIP file in the dist folder
echo   2. Extract the ZIP file
echo   3. Run "Super Skull God Pro.exe"
echo.
echo The executable can be shared with others!
echo ========================================
echo.
pause
