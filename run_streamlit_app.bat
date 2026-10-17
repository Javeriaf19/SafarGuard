@echo off
title SafarGuard - AI Streamlit App
echo ========================================================
echo   SafarGuard (Hacktoberfest Hack Day Lahore 2026)
echo   Launching AI Multimodal Engine on http://localhost:8501
echo ========================================================
cd /d "%~dp0"

set "PYPATH=C:\Users\Javeria\AppData\Local\Programs\Python\Python312"
set "PATH=%PYPATH%;%PYPATH%\Scripts;%PATH%"

echo Opening http://localhost:8501 in your default browser...
start http://localhost:8501

echo Starting Streamlit server...
python -m streamlit run app.py --server.port 8501

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Running with direct path...
    "%PYPATH%\Scripts\streamlit.exe" run app.py --server.port 8501
)

pause
