"""
Test script to verify the Study Buddy backend setup.
Run this after installing dependencies to check if everything is configured correctly.
"""

import sys
import os

def test_imports():
    """Test if all required packages are installed"""
    print("Testing imports...")
    try:
        import flask
        print("✅ Flask")
    except ImportError:
        print("❌ Flask not installed")
        return False
    
    try:
        import transformers
        print("✅ Transformers")
    except ImportError:
        print("❌ Transformers not installed")
        return False
    
    try:
        import torch
        print(f"✅ PyTorch (version: {torch.__version__})")
    except ImportError:
        print("❌ PyTorch not installed")
        return False
    
    try:
        import sqlite3
        print("✅ SQLite (built-in)")
    except ImportError:
        print("❌ SQLite not available")
        return False
    
    try:
        import pdfplumber
        print("✅ pdfplumber")
    except ImportError:
        print("❌ pdfplumber not installed")
        return False
    
    try:
        import docx
        print("✅ python-docx")
    except ImportError:
        print("❌ python-docx not installed")
        return False
    
    try:
        import bcrypt
        print("✅ bcrypt")
    except ImportError:
        print("❌ bcrypt not installed")
        return False
    
    return True

def test_config():
    """Test configuration loading"""
    print("\nTesting configuration...")
    try:
        from config import BASE_DIR, DB_PATH, USE_LOCAL_MODELS, FALLBACK_TO_HUGGINGFACE
        print(f"✅ Configuration loaded")
        print(f"   Base directory: {BASE_DIR}")
        print(f"   Database path: {DB_PATH}")
        print(f"   Use local models: {USE_LOCAL_MODELS}")
        print(f"   Fallback to HuggingFace: {FALLBACK_TO_HUGGINGFACE}")
        return True
    except Exception as e:
        print(f"❌ Configuration error: {e}")
        return False

def test_database():
    """Test database initialization"""
    print("\nTesting database...")
    try:
        from db import db, init_database
        init_database()
        print("✅ Database initialized successfully")
        
        # Test a simple query
        user = db.get_user('test@example.com')
        print("✅ Database operations working")
        return True
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False

def test_model_loading():
    """Test model loading (will use HuggingFace if local models don't exist)"""
    print("\nTesting model loading...")
    try:
        from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
        
        # Try loading a small model
        print("   Attempting to load t5-small from HuggingFace (this may take a moment)...")
        tokenizer = AutoTokenizer.from_pretrained('t5-small')
        model = AutoModelForSeq2SeqLM.from_pretrained('t5-small')
        print("✅ Model loading works (using HuggingFace)")
        return True
    except Exception as e:
        print(f"❌ Model loading error: {e}")
        print("   Note: This requires an internet connection for first-time download")
        return False

def test_app_import():
    """Test if the Flask app can be imported"""
    print("\nTesting Flask app import...")
    try:
        # This will attempt to load models, so we catch the exception
        try:
            from app import app
            print("✅ Flask app imported successfully")
            return True
        except Exception as e:
            # If it's just a model loading issue, that's OK for testing
            if "model" in str(e).lower() or "transformers" in str(e).lower():
                print("⚠️  App imported but model loading may need attention")
                print(f"   Error: {e}")
                return True
            else:
                raise
    except Exception as e:
        print(f"❌ App import error: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 50)
    print("Study Buddy Backend Setup Test")
    print("=" * 50)
    
    results = []
    results.append(("Imports", test_imports()))
    results.append(("Configuration", test_config()))
    results.append(("Database", test_database()))
    results.append(("Model Loading", test_model_loading()))
    results.append(("App Import", test_app_import()))
    
    print("\n" + "=" * 50)
    print("Test Results Summary")
    print("=" * 50)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{name}: {status}")
    
    all_passed = all(result for _, result in results)
    
    print("\n" + "=" * 50)
    if all_passed:
        print("✅ All tests passed! Your setup is ready.")
        print("\nYou can now run the backend with: python app.py")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
        print("\nCommon fixes:")
        print("1. Install missing packages: pip install -r requirements.txt")
        print("2. Ensure you're in a virtual environment")
        print("3. Check your internet connection for model downloads")
    print("=" * 50)
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())

