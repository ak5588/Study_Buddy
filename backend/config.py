"""
Configuration management for the Study Buddy application.
Centralizes all configuration settings with environment variable support.
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Flask Configuration
FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', 5002))

# Database Configuration
DB_PATH = os.getenv('DB_PATH', os.path.join(BASE_DIR, 'studybuddy.db'))

# Model Configuration
# Use local models if available, otherwise fall back to HuggingFace models
USE_LOCAL_MODELS = os.getenv('USE_LOCAL_MODELS', 'true').lower() == 'true'
FALLBACK_TO_HUGGINGFACE = os.getenv('FALLBACK_TO_HUGGINGFACE', 'true').lower() == 'true'

# Local model paths
SUMMARY_MODEL_PATH = os.getenv('SUMMARY_MODEL_PATH', os.path.join(BASE_DIR, 'Models', 'summary_train_model_1'))
QUESTION_GENERATION_MODEL_PATH = os.getenv('QUESTION_GENERATION_MODEL_PATH', 
                                           os.path.join(BASE_DIR, 'Models', 'question_generation_model'))
QUIZ_MODEL_PATH = os.getenv('QUIZ_MODEL_PATH', os.path.join(BASE_DIR, 'Models', 'Quiz_Model_Recommended'))

# HuggingFace fallback models (public models that don't require authentication)
HUGGINGFACE_SUMMARY_MODEL = os.getenv('HUGGINGFACE_SUMMARY_MODEL', 't5-small')
HUGGINGFACE_QUESTION_MODEL = os.getenv('HUGGINGFACE_QUESTION_MODEL', 't5-small')
HUGGINGFACE_QUIZ_MODEL = os.getenv('HUGGINGFACE_QUIZ_MODEL', 't5-small')

# Alternative: Use flan-t5 models (better quality but larger)
# HUGGINGFACE_SUMMARY_MODEL = 'google/flan-t5-base'
# HUGGINGFACE_QUESTION_MODEL = 'google/flan-t5-base'
# HUGGINGFACE_QUIZ_MODEL = 'google/flan-t5-base'

# Convert relative paths to absolute paths
if not os.path.isabs(SUMMARY_MODEL_PATH):
    SUMMARY_MODEL_PATH = os.path.join(BASE_DIR, SUMMARY_MODEL_PATH)
if not os.path.isabs(QUESTION_GENERATION_MODEL_PATH):
    QUESTION_GENERATION_MODEL_PATH = os.path.join(BASE_DIR, QUESTION_GENERATION_MODEL_PATH)
if not os.path.isabs(QUIZ_MODEL_PATH):
    QUIZ_MODEL_PATH = os.path.join(BASE_DIR, QUIZ_MODEL_PATH)
if not os.path.isabs(DB_PATH):
    DB_PATH = os.path.join(BASE_DIR, DB_PATH)

# Upload folders
UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
STUDY_MATERIALS_FOLDER = os.getenv('STUDY_MATERIALS_FOLDER', 'study_materials')

# Convert relative paths to absolute
if not os.path.isabs(UPLOAD_FOLDER):
    UPLOAD_FOLDER = os.path.join(BASE_DIR, UPLOAD_FOLDER)
if not os.path.isabs(STUDY_MATERIALS_FOLDER):
    STUDY_MATERIALS_FOLDER = os.path.join(BASE_DIR, STUDY_MATERIALS_FOLDER)

# Ensure upload directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(STUDY_MATERIALS_FOLDER, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'pptx', 'txt'}

# Model loading configuration
MODEL_LOAD_DEVICE = os.getenv('MODEL_LOAD_DEVICE', 'cpu')  # 'cpu' or 'cuda'
TORCH_DTYPE = os.getenv('TORCH_DTYPE', 'float32')  # 'float32' or 'float16'

def get_torch_dtype():
    """Get torch dtype from string"""
    import torch
    if TORCH_DTYPE == 'float16':
        return torch.float16
    return torch.float32

def model_exists(model_path: str) -> bool:
    """Check if a local model exists"""
    return os.path.exists(model_path) and os.path.exists(
        os.path.join(model_path, 'config.json')
    )

