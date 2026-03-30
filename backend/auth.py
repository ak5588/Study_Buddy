from functools import wraps
from flask import request, jsonify, current_app
import bcrypt
from db import db
from utils import error_response

def hash_password(password: str) -> bytes:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def check_password(password: str, hashed: bytes) -> bool:
    """Check if a password matches its hash."""
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

def require_auth(f):
    """Decorator to require authentication for routes."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return error_response('No authorization header', 401)
            
        try:
            # Extract token from Bearer header
            token = auth_header.split(' ')[1]
            user = db.validate_token(token)
            
            if not user:
                return error_response('Invalid or expired token', 401)
                
            # Add user to request
            request.user = user
            return f(*args, **kwargs)
            
        except Exception as e:
            current_app.logger.error(f"Auth error: {str(e)}")
            return error_response('Authentication failed', 401)
            
    return decorated

def require_teacher(f):
    """Decorator to require teacher role."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return error_response('No authorization header', 401)
            
        try:
            # Extract token from Bearer header
            token = auth_header.split(' ')[1]
            user = db.validate_token(token)
            
            if not user:
                return error_response('Invalid or expired token', 401)
                
            if user.get('role') != 'teacher':
                return error_response('Teacher access required', 403)
                
            # Add user to request
            request.user = user
            return f(*args, **kwargs)
            
        except Exception as e:
            current_app.logger.error(f"Auth error: {str(e)}")
            return error_response('Authentication failed', 401)
            
    return decorated