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

echo [3/4] Creating web release ZIP...
REM Delete old ZIP if it exists
if exist super-skull-god-pro-web.zip del super-skull-god-pro-web.zip
REM Create new ZIP using PowerShell
powershell -Command "Compress-Archive -Path www\* -DestinationPath super-skull-god-pro-web.zip -Force"
echo Web ZIP created: super-skull-god-pro-web.zip
echo.

echo [4/4] Copying to Android...
call npx cap copy android

echo.
echo ========================================
echo  Preparation Complete!
echo ========================================
echo.
echo Building the APK...
cd android
call gradlew.bat clean
call gradlew.bat assembleDebug
cd ..

echo.
echo ========================================
echo  Build Complete!
echo ========================================
dir android\app\build\outputs\apk\debug\*.apk
echo.
echo Or for release build:
echo   gradlew.bat assembleRelease
