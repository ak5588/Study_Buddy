@echo off
echo Starting Study Buddy Backend...
echo.

REM Check if virtual environment exists
if not exist venv (
    echo ERROR: Virtual environment not found!
    echo Please run setup_venv.bat first to create the virtual environment.
    pause
    exit /b 1
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Check if .env file exists
if not exist .env (
    echo WARNING: .env file not found!
    echo Creating .env from .env.example...
    if exist .env.example (
        copy .env.example .env
        echo Please edit .env file with your configuration
    ) else (
        echo ERROR: .env.example not found!
        pause
        exit /b 1
    )
)

echo Running Flask application...
echo Make sure you have created a .env file (copy env.example to .env and edit if needed)
echo.

REM Create .env from env.example if it doesn't exist
if not exist .env (
    if exist env.example (
        echo Creating .env file from env.example...
        copy env.example .env
        echo.
        echo WARNING: Please edit .env file with your configuration before running!
        echo Press any key to continue anyway or Ctrl+C to cancel...
        pause >nul
    )
)

python app.py

pause

