@echo off
setlocal
title Minecraft Network Setup

set "SCRIPT=%~dp0Join-MinecraftNetwork.ps1"

if not exist "%SCRIPT%" (
    echo ERROR: Join-MinecraftNetwork.ps1 must be in the same folder as this file.
    echo Keep both files together on a local drive, for example C:\Temp.
    echo.
    pause
    exit /b 1
)

:: Not admin? Relaunch this file elevated.
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting administrator access...
    powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    if %errorlevel% neq 0 (
        echo.
        echo Administrator access was declined or failed.
        pause
    )
    exit /b
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%"
set "CODE=%errorlevel%"

if not "%CODE%"=="0" (
    echo.
    echo Setup exited with code %CODE%.
    pause
)

exit /b %CODE%
