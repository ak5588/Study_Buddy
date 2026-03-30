from flask import jsonify
from typing import Optional, Any, Dict, Union
from http import HTTPStatus

def api_response(
    success: bool,
    message: Optional[str] = None,
    data: Optional[Any] = None,
    status_code: Union[int, HTTPStatus] = HTTPStatus.OK,
    error: Optional[str] = None
) -> tuple:
    """
    Create a standardized API response.
    
    Args:
        success: Whether the operation was successful
        message: Optional success message
        data: Optional data to include in response
        status_code: HTTP status code (default: 200)
        error: Optional error message
    
    Returns:
        tuple: (response_json, status_code)
    """
    response: Dict[str, Any] = {
        "success": success
    }
    
    if message:
        response["message"] = message
    if data is not None:
        response["data"] = data
    if error:
        response["error"] = error
        
    return jsonify(response), status_code

def error_response(
    message: str,
    status_code: Union[int, HTTPStatus] = HTTPStatus.BAD_REQUEST,
    details: Optional[Any] = None
) -> tuple:
    """
    Create a standardized error response.
    
    Args:
        message: Error message
        status_code: HTTP status code (default: 400)
        details: Optional error details
    
    Returns:
        tuple: (response_json, status_code)
    """
    response = {
        "success": False,
        "error": message
    }
    if details:
        response["details"] = details
        
    return jsonify(response), status_code