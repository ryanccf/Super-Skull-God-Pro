@echo off
echo ========================================
echo  Super Skull God Pro - Android Build
echo ========================================
echo.

echo [1/3] Incrementing version numbers...
powershell -ExecutionPolicy Bypass -File increment-version.ps1
echo.

echo [2/3] Copying web files to www directory...
REM Create www directory if it doesn't exist
if not exist www mkdir www

REM Copy index.html
copy /Y index.html www\index.html >nul

REM Copy src folder
xcopy /E /I /Y src www\src >nul

echo Web files copied successfully!
echo.

echo [3/3] Copying to Android...
call npx cap copy android

echo.
echo ========================================
echo  Preparation Complete!
echo ========================================
echo.
echo You can now build the APK:
echo   cd android
echo   gradlew.bat clean
echo   gradlew.bat assembleDebug
echo.
echo Or for release build:
echo   gradlew.bat assembleRelease
