"""UserAPIs.py - Provides APIs for CR and other operations on templates"""
from src.DataModel.User import User
from flask import g, request, current_app
from flask_restful import Resource
from marshmallow import Schema, fields
from marshmallow_sqlalchemy import ModelSchema
from .AuthorizeAPIs import AUTH
from .baseAPI import BASE_SPEC
from .ApiUtil import api_message, validate_json_contains,\
                     wrap_with_links, \
                     API_CREATE_EXISTS, API_OBJECT_NOT_FOUND,\
                     API_SCHEMA_ERRORS, API_SUCCESS

# Path constants for APIs defined in this module
BASE_USER_PATH = '/user'
USER_API_PATH = BASE_USER_PATH + '/<int:user_id>'
USERS_API_PATH = '/users'

# Reference links to be included in returned objects
USER_LINKS = {
    'self': BASE_USER_PATH + '/{}',
}

# Marshmallow schema for model conversion to / from JSON
class UserSchema(ModelSchema):
    """Marshmallow schema for User data model object"""
    class Meta:
        """Class providing model link for UserSchema"""
        model = User
        exclude = ["password_hash"]
USER_SCHEMA = UserSchema()

# Definition of schema object reference for API definition
BASE_SPEC.definition('User',
                     schema=UserSchema,
                     extra_fields={'links': {'$ref': '#/definitions/ReferenceLinks'}})

# API endpoint class for Read / Update / Delete
class UserRes(Resource):
    """Class for handling RUD operations for a user
        ---
        get:
            responses:
                200:
                    schema:
                        'UserSchema'
        put:
            responses:
                200:
                    schema:
                        $ref: '#/definitions/SuccessResponse'
        delete:
            responses:
                200:
                    schema:
                        $ref: '#/definitions/SuccessResponse'
        """

    def get(self, user_id):
        """Handle read (GET) operation for a user"""
        return wrap_with_links(USER_SCHEMA.dump(g.db_session.query(User).get(user_id)).data,
                               USER_LINKS, 'user_id', request.script_root)

    @AUTH.login_required
    def put(self, user_id):
        """Handle PUT (Edit) operations for a user"""
        api_method = 'UserRes.put'
        json, message = validate_json_contains(api_method, request, ['username'])
        # If we don't have valid json payload, return message
        if not json:
            return message
        # Get the user
        user = g.db_session.query(User).get(user_id)
        if user is None:
            return api_message(api_method,
                               API_OBJECT_NOT_FOUND.format('Edit', 'User',
                                                           'user_id = ' + str(user_id)), 400)
        # Set the edited fields
        if 'password' in json:
            user.hash_password(json['password'])
        user, errors = USER_SCHEMA.load(json, instance=user, partial=True)
        if errors:
            return api_message(api_method, API_SCHEMA_ERRORS.format('User', 'edit', errors), 400)
        # Add the user to the session and commit
        g.db_session.add(user)
        g.db_session.commit()
        return api_message(api_method, API_SUCCESS.format('User', 'edited'), 200)

    @AUTH.login_required
    def delete(self, user_id):
        """Handle DELETE (Delete) operations for a user"""
        api_method = 'UserRes.delete'
        user = g.db_session.query(User).get(user_id)
        if user is None:
            return api_message(api_method,
                               API_OBJECT_NOT_FOUND.format('Delete', 'User',
                                                           'userid = ' + str(user_id)), 400)
        g.db_session.delete(user)
        g.db_session.commit()
        return {}, 204

# Add the path to the API specification now that the resource class is defined
BASE_SPEC.add_path(path='/user/{user_id}', view=UserRes)

class UsersRes(Resource):
    """Class for handling lists of users
    ---
        get:
            responses:
                200:
                    schema:
                        type: array
                        items:
                            '$ref': '#/definition/User'
        post:
            responses:
                201:
                    schema:
                        $ref: '#/definitions/SuccessResponse'
    """
    @AUTH.login_required
    def get(self):
        """Handle GET (Read) operation for lists of users"""
        return wrap_with_links(USER_SCHEMA.dump(g.db_session.query(User).all(), many=True).data,
                               USER_LINKS, 'user_id', request.script_root, many=True)

    def post(self):
        """Handle POST (Create) operations for a user"""
        api_method = 'UserRes.post'
        json, message = validate_json_contains(api_method, request, ['username', 'password'])
        # If we don't have valid json payload, return message
        if not json:
            return message
        # Check if the username is already in use, and if so return an error
        user = g.db_session.query(User).filter(User.username == json['username']).one_or_none()
        if user is not None:
            return api_message(api_method,
                               API_CREATE_EXISTS.format('User',
                                                        'username = ' + json['username']), 400)
        # Basic checks look good, so create the user
        user, errors = USER_SCHEMA.load(json, session=g.db_session)
        if errors:
            return api_message(api_method, API_SCHEMA_ERRORS.format('User', 'create', errors), 400)
        current_app.logger.info('Creating user ' + user.username)
        g.db_session.add(user)
        g.db_session.commit()
        return api_message(api_method, API_SUCCESS.format('User', 'created'), 201, user.user_id)

BASE_SPEC.add_path(path='/users', view=UsersRes)
