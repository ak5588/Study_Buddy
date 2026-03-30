"""
SQLite Database Setup and Operations
Replaces MongoDB with a local SQLite database for better portability and local testing.
"""

import sqlite3
import logging
import os
from contextlib import contextmanager
from datetime import datetime
from typing import Optional, Dict, List, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.getenv('DB_PATH', os.path.join(BASE_DIR, 'studybuddy.db'))

# Convert relative path to absolute if needed
if not os.path.isabs(DB_PATH):
    DB_PATH = os.path.join(BASE_DIR, DB_PATH)

# Ensure the directory exists
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Enable column access by name
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Database error: {e}")
        raise
    finally:
        conn.close()


def init_database():
    """Initialize the database with all required tables"""
    logger.info(f"Initializing database at {DB_PATH}")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Teachers table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS teachers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                bio TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (email) REFERENCES users(email)
            )
        """)
        
        # Study materials table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS study_materials (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                teacher_email TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                file_path TEXT NOT NULL,
                filename TEXT NOT NULL,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (teacher_email) REFERENCES teachers(email)
            )
        """)
        
        # Summaries table (store generated summaries for history)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS summaries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_email TEXT,
                source_type TEXT NOT NULL,
                source_content TEXT,
                source_file_path TEXT,
                summary_text TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_email) REFERENCES users(email)
            )
        """)
        
        # Logs table (for tracking operations)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS operation_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                endpoint TEXT NOT NULL,
                operation_type TEXT NOT NULL,
                user_email TEXT,
                details TEXT,
                status TEXT NOT NULL,
                error_message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Create indexes for better performance
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_teachers_email ON teachers(email)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_materials_teacher ON study_materials(teacher_email)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_summaries_user ON summaries(user_email)")
        
        conn.commit()
        logger.info("Database initialized successfully")


# Initialize database on import
init_database()


class Database:
    """Database operations class"""
    
    @staticmethod
    def create_user(name: str, email: str, password: str, role: str) -> bool:
        """Create a new user"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
                    (name, email, password, role)
                )
                return True
        except sqlite3.IntegrityError:
            logger.warning(f"User with email {email} already exists")
            return False
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            raise
    
    @staticmethod
    def get_user(email: str, role: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Get user by email and optionally role"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                if role:
                    cursor.execute(
                        "SELECT * FROM users WHERE email = ? AND role = ?",
                        (email, role)
                    )
                else:
                    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
                
                row = cursor.fetchone()
                if row:
                    return dict(row)
                return None
        except Exception as e:
            logger.error(f"Error getting user: {e}")
            raise
    
    @staticmethod
    def create_or_update_teacher(email: str, name: str, bio: str) -> bool:
        """Create or update teacher profile"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                # Check if teacher exists
                cursor.execute("SELECT id FROM teachers WHERE email = ?", (email,))
                exists = cursor.fetchone()
                
                if exists:
                    cursor.execute(
                        "UPDATE teachers SET name = ?, bio = ?, updated_at = ? WHERE email = ?",
                        (name, bio, datetime.utcnow(), email)
                    )
                else:
                    cursor.execute(
                        "INSERT INTO teachers (email, name, bio) VALUES (?, ?, ?)",
                        (email, name, bio)
                    )
                return True
        except Exception as e:
            logger.error(f"Error creating/updating teacher: {e}")
            raise
    
    @staticmethod
    def get_teacher(email: str) -> Optional[Dict[str, Any]]:
        """Get teacher profile by email"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM teachers WHERE email = ?", (email,))
                row = cursor.fetchone()
                if row:
                    return dict(row)
                return None
        except Exception as e:
            logger.error(f"Error getting teacher: {e}")
            raise
    
    @staticmethod
    def add_study_material(teacher_email: str, title: str, description: str, 
                          file_path: str, filename: str) -> bool:
        """Add a study material"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    """INSERT INTO study_materials 
                       (teacher_email, title, description, file_path, filename) 
                       VALUES (?, ?, ?, ?, ?)""",
                    (teacher_email, title, description, file_path, filename)
                )
                return True
        except Exception as e:
            logger.error(f"Error adding study material: {e}")
            raise
    
    @staticmethod
    def get_study_materials(teacher_email: str) -> List[Dict[str, Any]]:
        """Get all study materials for a teacher"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT * FROM study_materials WHERE teacher_email = ? ORDER BY uploaded_at DESC",
                    (teacher_email,)
                )
                rows = cursor.fetchall()
                return [dict(row) for row in rows]
        except Exception as e:
            logger.error(f"Error getting study materials: {e}")
            raise
    
    @staticmethod
    def save_summary(user_email: Optional[str], source_type: str, 
                    source_content: Optional[str], source_file_path: Optional[str],
                    summary_text: str) -> int:
        """Save a generated summary"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    """INSERT INTO summaries 
                       (user_email, source_type, source_content, source_file_path, summary_text) 
                       VALUES (?, ?, ?, ?, ?)""",
                    (user_email, source_type, source_content, source_file_path, summary_text)
                )
                return cursor.lastrowid
        except Exception as e:
            logger.error(f"Error saving summary: {e}")
            raise
    
    @staticmethod
    def log_operation(endpoint: str, operation_type: str, user_email: Optional[str],
                     details: Optional[str], status: str, error_message: Optional[str] = None):
        """Log an operation"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    """INSERT INTO operation_logs 
                       (endpoint, operation_type, user_email, details, status, error_message) 
                       VALUES (?, ?, ?, ?, ?, ?)""",
                    (endpoint, operation_type, user_email, details, status, error_message)
                )
        except Exception as e:
            logger.error(f"Error logging operation: {e}")
            raise


# Create database instance for easy access
db = Database()

# For backward compatibility with existing code
# These will be used by app.py
def get_users_collection():
    """Mock collection-like interface for backward compatibility"""
    class UsersCollection:
        @staticmethod
        def find_one(query: Dict) -> Optional[Dict]:
            email = query.get('email')
            role = query.get('role')
            return db.get_user(email, role)
        
        @staticmethod
        def insert_one(data: Dict):
            db.create_user(
                data['name'],
                data['email'],
                data['password'],
                data['role']
            )
    return UsersCollection()

def get_teachers_collection():
    """Mock collection-like interface for backward compatibility"""
    class TeachersCollection:
        @staticmethod
        def find_one(query: Dict, projection: Optional[Dict] = None) -> Optional[Dict]:
            email = query.get('email')
            teacher = db.get_teacher(email)
            if teacher and projection and '_id' in projection and projection['_id'] == 0:
                teacher.pop('id', None)
            return teacher
        
        @staticmethod
        def update_one(query: Dict, update: Dict):
            email = query.get('email')
            set_data = update.get('$set', {})
            db.create_or_update_teacher(
                email,
                set_data.get('name', ''),
                set_data.get('bio', '')
            )
        
        @staticmethod
        def insert_one(data: Dict):
            db.create_or_update_teacher(
                data['email'],
                data['name'],
                data.get('bio', '')
            )
    return TeachersCollection()

def get_materials_collection():
    """Mock collection-like interface for backward compatibility"""
    class MaterialsCollection:
        @staticmethod
        def find(query: Dict, projection: Optional[Dict] = None) -> List[Dict]:
            teacher_email = query.get('teacher_email')
            materials = db.get_study_materials(teacher_email)
            if projection and '_id' in projection and projection['_id'] == 0:
                for material in materials:
                    material.pop('id', None)
            return materials
        
        @staticmethod
        def insert_one(data: Dict):
            db.add_study_material(
                data['teacher_email'],
                data['title'],
                data.get('description', ''),
                data['file_path'],
                os.path.basename(data['file_path'])
            )
    return MaterialsCollection()

# Initialize collections
users_collection = get_users_collection()
teachers_collection = get_teachers_collection()
materials_collection = get_materials_collection()

logger.info(f"Database initialized at {DB_PATH}")
