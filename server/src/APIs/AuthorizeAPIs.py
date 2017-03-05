"""AuthorizeAPIs.py - Module that implements the user authorization APIs for this application """
from flask import g, jsonify, current_app, request
from flask_restful import Resource
from flask_httpauth import HTTPBasicAuth
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
from facebook import GraphAPI, GraphAPIError
from src.DataModel.User import User
from .ApiUtil import api_message, validate_json_contains,\
                     API_FACEBOOK_PROFILE, API_SUCCESS

# This will be a global constant imported by other APIs
AUTH = HTTPBasicAuth()

# Facebook application details
FB_APP_NAME = 'OurLifeStories.net'
FB_APP_ID = 323284451372735
FB_APP_SECRET = 'b541aa986289449d3f0c718a4fe1d5f9'

# Helper method to verify tokens
def verify_auth_token(token, secret_key):
    """Method to verify authorizing tokens from incoming requests"""
    ser = Serializer(secret_key)
    try:
        data = ser.loads(token)
    except SignatureExpired:
        return None    # valid token, but expired
    except BadSignature:
        return None    # invalid token
    user = g.db_session.query(User).get(data['user_id'])
    return user

@AUTH.verify_password
def verify_password(username_or_token, password):
    """Method to verify passwords provided as part of API calls"""
    # first try to authenticate by token
    user = verify_auth_token(username_or_token, current_app.config['SECRET_KEY'])
    if not user:
        # try to authenticate with username/password
        user = g.db_session.query(User).filter(User.username == username_or_token).one_or_none()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True

class GetAuthToken(Resource):
    """Class implementing resource handler for authorization APIs"""
    @AUTH.login_required
    def get(self):
        token = g.user.generate_auth_token(current_app.config['SECRET_KEY'], 600)
        return jsonify({'token': token.decode('ascii'), 'duration': 600})

class LoginViaFacebook(Resource):
    """Class implementing Facebook authorization for app"""
    def post(self):
        """Handle the POST request to get an authorization token via Facebook authorization"""
        api_method = 'LoginViaFacebook.post'
        json, message = validate_json_contains(api_method, request, ['access_token'], 401)
        if not json:
            return message
        graph = None
        profile = None
        graph = GraphAPI(json['access_token'])
        try:
            profile = graph.get_object('me?fields=id,name,email,first_name,last_name')
        except GraphAPIError:
            return api_message(api_method, API_FACEBOOK_PROFILE, 401)
#TODO: Write code that assumes we're going to use email as userid for base app
        return api_message(api_method, API_SUCCESS.format('Facebook', 'login'), 200)

class GetLogin(Resource):
    """Class implementing the REST API endpoing for login requests"""
    @AUTH.login_required
    def get(self):
        """Method handling read requests for login API endpoint"""
        token = g.user.generate_auth_token(current_app.config['SECRET_KEY'], 600)
        return {
            'token':token.decode('ascii')
        }, 200
