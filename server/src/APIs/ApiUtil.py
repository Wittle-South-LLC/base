"""ApiUtil.py - Utilities for RESTful APIs"""
from flask import current_app

# Base messages, allowing for future localization of API error messages
API_REQUIRES_JSON = 'All PUT/POST API requests require JSON, and this request did not'
API_REQUIRES_FIELDS = 'Must provide {} for this API'
API_CREATE_EXISTS = '{} with {} already exists, create ignored'
API_OBJECT_NOT_FOUND = '{} failed because {} with {} not found'
API_SCHEMA_ERRORS = '{} failed {} due to errors: {}'
API_SUCCESS = '{} {} successfully'
API_FACEBOOK_PROFILE = 'Unable to get required Facebook profile elements'

def api_message(api_method, message, code, obj_id=None):
    """Creates and debug logs API response when a payload is not required"""
    # Set success component of return based on code
    success = True
    if code >= 400:
        success = False
    resp = {
        'success': success,
        'msg': message,
    }
    if obj_id:
        resp['id'] = obj_id
        current_app.logger.debug('API %s returning %s with status %d and id %d',
                                 api_method, message, code, obj_id)
    else:
        current_app.logger.debug('API %s returning %s with status %d',
                                 api_method, message, code)
    return resp, code

def validate_json_contains(api_method, request, fields, code=400):
    """Validates that a request contains JSON with specific fields"""
    json = request.get_json()

    # If the required fields are not in the json, return none and error payload
    for field in fields:
        if not field in json:
            return None, api_message(api_method, API_REQUIRES_FIELDS.format(fields), code)
    # If all required fields are present, return the json with no error message
    return json, None
