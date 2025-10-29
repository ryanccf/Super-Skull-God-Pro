@echo off
echo Copying web files to www directory...

REM Create www directory if it doesn't exist
if not exist www mkdir www

REM Copy index.html
copy /Y index.html www\index.html

REM Copy src folder
xcopy /E /I /Y src www\src

echo Web files copied successfully!
echo.
echo Syncing to Android...
call npx cap sync android

echo.
echo Done! You can now build the APK:
echo   cd android
echo   gradlew.bat clean
echo   gradlew.bat assembleDebug
