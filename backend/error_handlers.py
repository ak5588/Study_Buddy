import os
from datetime import timedelta
from flask import jsonify
from config import BASE_DIR, UPLOAD_FOLDER, STUDY_MATERIALS_FOLDER

def setup_error_handlers(app):
    # Environment validation
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
        app.logger.info(f"Created upload folder: {UPLOAD_FOLDER}")

    if not os.path.exists(STUDY_MATERIALS_FOLDER):
        os.makedirs(STUDY_MATERIALS_FOLDER)
        app.logger.info(f"Created study materials folder: {STUDY_MATERIALS_FOLDER}")

    # Session configuration
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_FILE_DIR'] = os.path.join(BASE_DIR, 'flask_session')
    app.config['SESSION_PERMANENT'] = False
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=5)

    if not os.path.exists(app.config['SESSION_FILE_DIR']):
        os.makedirs(app.config['SESSION_FILE_DIR'])
        app.logger.info(f"Created session directory: {app.config['SESSION_FILE_DIR']}")

    # Security headers
    @app.after_request
    def add_security_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Content-Security-Policy'] = "default-src 'self'"
        return response

    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f"Server Error: {error}")
        return jsonify({"error": "Internal server error"}), 500

    @app.errorhandler(Exception)
    def handle_exception(e):
        app.logger.error(f"Unhandled Exception: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

    return app