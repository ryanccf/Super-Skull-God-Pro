@echo off
echo Building Windows EXE...
echo.
call npm install
call npm run build:win64
echo.
echo Done! Check the "dist" folder for your Windows build.
pause
