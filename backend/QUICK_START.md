# Quick Start Guide - Study Buddy Backend

## 🚀 Fastest Way to Run (Windows)

1. **Open PowerShell or Command Prompt in the `backend` folder**

2. **Run setup:**
   ```bash
   setup_venv.bat
   ```
   This will:
   - Create a virtual environment
   - Install all dependencies
   - Set up everything automatically

3. **Start the server:**
   ```bash
   run.bat
   ```

That's it! Your backend will start on `http://localhost:5002`

---

## 📋 What the Setup Does

1. ✅ Creates isolated Python environment (no dependency conflicts)
2. ✅ Installs all required packages in the virtual environment
3. ✅ Creates `.env` file for configuration
4. ✅ Sets up model paths automatically

---

## ⚙️ Configuration (.env file)

After first run, edit `backend/.env` if needed:

```env
# Change MongoDB URI if using remote MongoDB
MONGO_URI=mongodb://localhost:27017/

# Model paths are already set correctly (relative to backend folder)
SUMMARY_MODEL_PATH=./Models/summary_train_model_1
```

---

## 🐛 Troubleshooting

**If setup fails:**
- Make sure Python 3.8+ is installed: `python --version`
- Check internet connection (downloads packages)
- Try: `python -m pip install --upgrade pip` first

**If models don't load:**
- Check that model folders exist in `backend/Models/`
- Verify paths in `.env` file
- Check logs for specific errors

**If MongoDB errors appear:**
- This is normal if MongoDB isn't running
- AI features (summarize, quiz) work without MongoDB
- Only auth features need MongoDB

---

## 📝 Daily Usage

**To start server:**
```bash
cd backend
run.bat
```

**To stop server:**
- Press `Ctrl+C`

**To update dependencies:**
```bash
venv\Scripts\activate
pip install -r requirements.txt --upgrade
```

---

## 🧹 Clean Start

If something goes wrong, delete virtual environment and start fresh:

```bash
rmdir /s /q venv    # Remove old environment
setup_venv.bat      # Create new one
```

---

## ✅ Verification

After setup, you should see:
- ✅ Virtual environment created (`venv` folder)
- ✅ `.env` file created
- ✅ Server starts without errors
- ✅ Models load when first used

Check logs when you use AI features - they'll show which loading strategy worked!

