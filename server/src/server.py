"""server.py = This file is the main application file for the REST API server"""
import os.path
# import pprint
import logging
# from logging.handlers import TimedRotatingFileHandler
from flask import Flask, request, g, abort
from flask_restful import Api
from sqlalchemy import create_engine, event, exc, select
from sqlalchemy.orm import sessionmaker
from src.APIs.ApiUtil import API_REQUIRES_JSON
from src.APIs.UserAPIs import UserRes, UsersRes
from src.APIs.AuthorizeAPIs import GetAuthToken, LoginViaFacebook, GetLogin

# Instatiate the Flask app
APP = Flask(__name__)
#file_handler = TimedRotatingFileHandler('logs/olsnet_flask.log',when='h',interval=1)
LOGGER = APP.logger
LOGGER.setLevel(logging.DEBUG)
APP.debug = True
# app.debug = True
#logger.addHandler(file_handler)
LOGGER.debug('We have created a Flask app')

CONNECT_STRING = os.environ['BASE_CONNECT_STRING']
LOGGER.debug('Connect String = ' + CONNECT_STRING)

# Create database connection and sessionmaker
try:
    ENGINE = create_engine(CONNECT_STRING, pool_recycle=3600)
except exc.SQLAlchemyError:
    LOGGER.debug('Caught exception in create_engine: ', exc.SQLAlchemyError)
try:
    DBSESSION = sessionmaker(bind=ENGINE)
except exc.SQLAlchemyError:
    LOGGER.debug('Caught an exception in sessionmaker', exc.SQLAlchemyError)
LOGGER.debug('We have created a session')

APP.config['SECRET_KEY'] = os.environ['BASE_SECRET_KEY']
API = Api(APP)
LOGGER.debug('We have created an api')

# Authorization API endpoints
API.add_resource(GetAuthToken, '/token')
API.add_resource(LoginViaFacebook, '/fb_login')
API.add_resource(GetLogin, '/login')

# User API endpoints
API.add_resource(UsersRes, '/users')
API.add_resource(UserRes, '/user/<int:user_id>', endpoint='/user')

# Need to make sure that the use of the database session is
# scoped to the request to avoid open orm transactions between requests
@APP.before_request
def before_request():
    """Method to do work before the request"""
    g.db_session = DBSESSION()
    if (request.method == 'POST' or request.method == 'PUT') and \
        not request.is_json and request.path != '/shutdown':
        if request.path != '/fb_login':
            abort(400, API_REQUIRES_JSON)
        else:
            abort(401)

@APP.after_request
def after_request(func):
    """Method to do work after the request"""
    g.db_session.close()
    return func

# Need to recover if the sql server has closed the connection
# due to a timeout or other reason
@event.listens_for(ENGINE, "engine_connect")
def ping_connection(connection, branch):
    """Method to check if database connection is active """
    if branch:
        return

    save_should_close_with_result = connection.should_close_with_result
    connection.should_close_with_result = False

    try:
        connection.scalar(select([1]))
    except exc.DBAPIError as err:
        if err.connection_invalidated:
            LOGGER.info("Recovering from connection_invalidated")
            connection.scalar(select([1]))
        else:
            raise
    finally:
        connection.should_close_with_result = save_should_close_with_result

# Code here to ensure that the test scripts can shut down
# the server once it is launched
def shutdown_server():
    """Method to shut down the server"""
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

@APP.route('/shutdown', methods=['POST'])
def shutdown():
    """API Endpoing to call shut down server """
    shutdown_server()
    return 'Server shutting down...\n'
