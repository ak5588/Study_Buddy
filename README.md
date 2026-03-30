# Study Buddy - AI Summarizer Project

## Overview

Study Buddy is a web application designed to assist students and teachers with study materials, summarization, and quiz generation using AI models. The project consists of a React frontend and a Flask backend integrated with AI models (T5/FLAN-T5) for text summarization, question generation, and quiz generation.

## Features

- ✅ **User Authentication** - Sign Up / Sign In (Students and Teachers)
- ✅ **AI Text Summarization** - Generate abstractive summaries from text, files (PDF, DOCX, PPTX, TXT), or URLs
- ✅ **Question Generation** - AI-powered question generation from context
- ✅ **MCQ Generation** - Automatic multiple-choice question generation
- ✅ **Teacher Dashboard** - Profile management and study material uploads
- ✅ **SQLite Database** - Local database for user data, summaries, and logs
- ✅ **Model Fallback** - Automatic fallback to HuggingFace models if local models fail
- ✅ **Responsive Frontend** - Modern React UI with Tailwind CSS

## Project Structure

```
Study_Buddy_College_Project/
├── backend/                      # Flask backend API
│   ├── app.py                   # Main backend application
│   ├── db.py                    # SQLite database operations
│   ├── config.py                # Configuration management
│   ├── requirements.txt         # Python dependencies
│   ├── env.example              # Environment variables template
│   ├── Models/                  # Local fine-tuned models (optional)
│   │   ├── summary_train_model_1/
│   │   ├── question_generation_model/
│   │   └── Quiz_Model_Recommended/
│   ├── uploads/                 # Temporary file uploads
│   ├── study_materials/         # Teacher-uploaded materials
│   └── studybuddy.db            # SQLite database (created automatically)
├── src/                         # React frontend source code
│   ├── components/              # React components
│   ├── lib/                     # Helper libraries
│   └── ...
├── package.json                 # Frontend dependencies
└── README.md                   # This file
```

## Prerequisites

- **Python 3.10+** (recommended 3.10 or 3.11)
- **Node.js** (v16 or higher)
- **Git**
- **Virtual Environment** (included in setup scripts)

## Quick Start Guide

### 1. Backend Setup

#### Option A: Using Setup Scripts (Recommended)

**Windows:**
```bash
cd backend
setup_venv.bat
# Then activate the virtual environment
venv\Scripts\activate
# Copy environment file
copy env.example .env
# Run the application
python app.py
```

**Linux/Mac:**
```bash
cd backend
chmod +x setup_venv.sh run.sh
./setup_venv.sh
source venv/bin/activate
cp env.example .env
python app.py
```

#### Option B: Manual Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   # Windows
   copy env.example .env
   
   # Linux/Mac
   cp env.example .env
   ```

5. **Edit `.env` file** (optional - defaults work for local testing):
   - The default configuration will use SQLite database
   - Models will automatically fallback to HuggingFace if local models don't exist
   - See Configuration section below for details

6. **Run the backend:**
   ```bash
   python app.py
   ```

   The server will start on `http://localhost:5002`

### 2. Frontend Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   The app will be available at `http://localhost:5173` (or the port shown in terminal)

## Configuration

### Environment Variables (`.env` file)

The backend uses environment variables for configuration. Copy `backend/env.example` to `backend/.env` and adjust as needed:

#### Key Settings:

**Database:**
- `DB_PATH=./studybuddy.db` - SQLite database file path

**Models:**
- `USE_LOCAL_MODELS=true` - Use local fine-tuned models if available
- `FALLBACK_TO_HUGGINGFACE=true` - Auto-fallback to HuggingFace models
- `HUGGINGFACE_SUMMARY_MODEL=t5-small` - HuggingFace model for summarization
- `HUGGINGFACE_QUESTION_MODEL=t5-small` - HuggingFace model for questions
- `HUGGINGFACE_QUIZ_MODEL=t5-small` - HuggingFace model for quizzes

**Alternative Models:**
For better quality (but slower), you can use:
- `google/flan-t5-base` or `google/flan-t5-small`
- `t5-base` (larger than t5-small)

**Server:**
- `HOST=0.0.0.0` - Server host
- `PORT=5002` - Server port
- `FLASK_DEBUG=True` - Enable debug mode

## Database

The application uses **SQLite** for local development and testing. The database is automatically created on first run with the following tables:

- **users** - User accounts (students and teachers)
- **teachers** - Teacher profiles
- **study_materials** - Uploaded study materials
- **summaries** - Generated summaries (for history)
- **operation_logs** - Operation tracking and debugging

The database file (`studybuddy.db`) will be created in the `backend/` directory automatically.

## Model Loading

The application supports two model loading strategies:

### 1. Local Fine-tuned Models (Preferred)
If you have fine-tuned models in the `backend/Models/` directory, the app will use them automatically.

### 2. HuggingFace Fallback (Automatic)
If local models are missing or fail to load, the app automatically downloads and uses public HuggingFace models:
- Default: `t5-small` (fast, good quality)
- Alternative: `google/flan-t5-base` (better quality, slower)

**No configuration needed** - fallback happens automatically if `FALLBACK_TO_HUGGINGFACE=true`.

## API Endpoints

### AI Endpoints

- `POST /summarize` - Summarize text, file, or URL
  - Body: `{ "text": "..." }` or `{ "url": "..." }` or multipart file
  - Response: `{ "summary": "..." }`

- `POST /quiz` - Generate MCQ quiz
  - Body: `{ "quiz_data": "context text..." }`
  - Response: `{ "question": "...", "options": [...], "correct_answer": "..." }`

- `POST /question_answer` - Generate questions or answers
  - Body: `{ "context": "...", "question": "..." }`
  - Response: `{ "answer": "..." }` or `{ "questions": "..." }`

- `POST /important_questions` - Generate important questions
  - Body: `{ "important_data": "context..." }`
  - Response: `{ "important_questions": "..." }`

### Authentication Endpoints

- `POST /signup` - Register new user
- `POST /signin` - User login

### Teacher Endpoints

- `POST /teacher/profile` - Create/update teacher profile
- `GET /teacher/profile/<email>` - Get teacher profile
- `POST /teacher/materials` - Upload study material
- `GET /teacher/materials/<email>` - Get teacher materials

### Utility

- `GET /health` - Health check endpoint

## Testing

### Test Summarization Endpoint

```bash
# Using curl
curl -X POST http://localhost:5002/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Your long text here..."}'

# Using Python
import requests
response = requests.post(
    'http://localhost:5002/summarize',
    json={'text': 'Your long text here...'}
)
print(response.json())
```

### Test Health Check

```bash
curl http://localhost:5002/health
```

## Troubleshooting

### Model Loading Issues

**Problem:** "Failed to load model after trying all strategies"

**Solution:**
1. Ensure `FALLBACK_TO_HUGGINGFACE=true` in `.env`
2. The app will automatically download `t5-small` from HuggingFace
3. Check internet connection (required for first-time HuggingFace download)

### Database Issues

**Problem:** Database errors or connection issues

**Solution:**
- SQLite is file-based and doesn't require a separate server
- Ensure write permissions in the `backend/` directory
- Delete `studybuddy.db` to reset the database (will recreate automatically)

### Port Already in Use

**Problem:** "Address already in use"

**Solution:**
- Change `PORT` in `.env` to a different port (e.g., 5003)
- Or stop the process using port 5002

### Import Errors

**Problem:** Module not found errors

**Solution:**
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`
- Check Python version: `python --version` (should be 3.10+)

## Development Notes

### Adding New Models

1. Place model files in `backend/Models/your_model_name/`
2. Update `.env` with the model path
3. The app will detect and load the model automatically

### Database Schema Changes

To modify the database schema:
1. Edit `backend/db.py` in the `init_database()` function
2. Delete `studybuddy.db` to recreate with new schema
3. Or create migration scripts for production

## Production Deployment

For production:

1. Set `FLASK_DEBUG=False` in `.env`
2. Use a production WSGI server (e.g., Gunicorn)
3. Set up proper database backups for SQLite
4. Consider using PostgreSQL for production
5. Configure proper CORS origins
6. Use environment variables for sensitive data

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the logs in the terminal
3. Check the `/health` endpoint for system status

## Changelog

### Version 2.0 (Current)
- ✅ Migrated from MongoDB to SQLite
- ✅ Added automatic HuggingFace model fallback
- ✅ Improved model loading with multiple strategies
- ✅ Added comprehensive error handling
- ✅ Added operation logging
- ✅ Improved configuration management
- ✅ Added health check endpoint

---

**Built with ❤️ using Flask, React, and Transformers**

# Study_Buddy