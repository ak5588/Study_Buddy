# Quick Start - Terminal Commands

Follow these steps in order to set up and run the Study Buddy backend.

## Step 1: Navigate to Backend Directory

```bash
cd backend
```

## Step 2: Create Virtual Environment

**Windows:**
```bash
python -m venv venv
```

**Linux/Mac:**
```bash
python3 -m venv venv
```

## Step 3: Activate Virtual Environment

**Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```bash
venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

*You should see `(venv)` in your terminal prompt after activation.*

## Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

*This may take a few minutes as it downloads PyTorch and Transformers.*

## Step 5: Create Environment File

**Windows:**
```bash
copy env.example .env
```

**Linux/Mac:**
```bash
cp env.example .env
```

*(Optional: Edit `.env` file if you want to change any settings)*

## Step 6: Test Setup (Optional but Recommended)

```bash
python test_setup.py
```

*This verifies all dependencies are installed correctly.*

## Step 7: Run the Application

```bash
python app.py
```

*You should see:*
```
==================================================
Study Buddy AI Summarizer
==================================================
Starting server on http://0.0.0.0:5002
Database: SQLite at D:\...\backend\studybuddy.db
Debug mode: True
==================================================
```

## Step 8: Test in Another Terminal

Keep the server running, open a **new terminal window** and test:

```bash
# Health check
curl http://localhost:5002/health

# Or test summarization
curl -X POST http://localhost:5002/summarize -H "Content-Type: application/json" -d "{\"text\": \"The quick brown fox jumps over the lazy dog.\"}"
```

---

## Quick Reference

**Activate virtual environment:**
```bash
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

**Run server:**
```bash
python app.py
```

**Stop server:**
Press `Ctrl + C` in the terminal where server is running

**Deactivate virtual environment:**
```bash
deactivate
```

---

## Troubleshooting

**If `python` command not found:**
- Try `python3` instead
- Or `py` on Windows

**If virtual environment activation fails on Windows PowerShell:**
- Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Then try activation again

**If port 5002 is already in use:**
- Change `PORT=5003` in `.env` file
- Or stop the other process using port 5002

