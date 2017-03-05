"""UserAPIs.py - Provides APIs for CR and other operations on templates"""
from src.DataModel.User import User
from flask import g, request, current_app
from flask_restful import Resource
from marshmallow_sqlalchemy import ModelSchema
from .AuthorizeAPIs import AUTH
from .ApiUtil import api_message, validate_json_contains,\
                     API_CREATE_EXISTS, API_OBJECT_NOT_FOUND,\
                     API_SCHEMA_ERRORS, API_SUCCESS

class UserSchema(ModelSchema):
    """Marshmallow schema for User data model object"""
    class Meta:
        """Class providing model link for UserSchema"""
        model = User
        exclude = ["password_hash"]

USER_SCHEMA = UserSchema()

class UserRes(Resource):
    """Class for handling CRUD operations for a user"""

    def get(self, user_id):
        """Handle GET (Read) operation for lists of users"""
        return USER_SCHEMA.dump(g.db_session.query(User).get(user_id)).data

    def post(self, user_id):
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

class UsersRes(Resource):
    """Class for handling lists of users"""
    def get(self):
        """Handle GET (Read) operation for lists of users"""
        return USER_SCHEMA.dump(g.db_session.query(User).all(), many=True).data
