#!/bin/bash

echo "Starting Study Buddy Backend..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "ERROR: Virtual environment not found!"
    echo "Please run setup_venv.sh first to create the virtual environment."
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "WARNING: .env file not found!"
    if [ -f "env.example" ]; then
        echo "Creating .env from env.example..."
        cp env.example .env
        echo "Please edit .env file with your configuration"
    else
        echo "ERROR: env.example not found!"
        exit 1
    fi
fi

echo "Running Flask application..."
python app.py

