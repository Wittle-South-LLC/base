"""test-user.py - Tests of user component of data model & apis"""
import os.path
import logging
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from src.DataModel.User import User
from .TestUtil import get_response_with_auth

# Set up logger
LOGGER = logging.getLogger()

# Get connect string
CONNECT_STRING = os.environ['BASE_CONNECT_STRING']
assert CONNECT_STRING is not None

# Create database connection
ENGINE = create_engine(CONNECT_STRING)
# Bind ORM to session
DBSESSION = sessionmaker(bind=ENGINE)

# Get root of API URL
URL = os.environ['API_ROOT']
LOGGER.debug('url = ' + URL)

# Set a variable to store added ID across tests
added_id = -1

def test_user_db_query():
    """User: Test database query for default data"""
    session = DBSESSION()
    assert session.query(User).get(1).username == 'testing'

def test_user_add_no_json():
    """--> Test add API failure due to no json"""
    resp = get_response_with_auth('POST', URL + '/user/0')
    if resp.status_code >= 400:
        LOGGER.debug('Response Text: %s', resp.text)
    assert resp.status_code == 400

def test_user_add_no_username():
    """--> Test add API failure due to json with missing username"""
    user_json = {'preferences': {'color': 'red'}}
    resp = get_response_with_auth('POST', URL + '/users', user_json)
    if resp.status_code >= 400:
        LOGGER.debug('Response Text: %s', resp.text)
    assert resp.status_code == 400

def test_user_add_api_success():
    """--> Test add API success"""
    #pylint: disable=C0103,W0603
    global added_id
    user_json = {'username': "talw",
                 'password': "testing",
                 'preferences': {'color': 'red'}}
    resp = get_response_with_auth('POST', URL + '/users', user_json)
    LOGGER.debug('Posted user add, status code is: ' + str(resp.status_code))
    if resp.status_code >= 400:
        LOGGER.debug('Response text = %s', resp.text)
    assert resp.status_code == 201
    json = resp.json()
    assert json['id'] > 0
    added_id = json['id']

def test_user_lookup_after_add():
    """--> Test that the user added can be read"""
    resp = get_response_with_auth('GET', URL + '/user/' + str(added_id))
    assert resp.status_code == 200
    json = resp.json()
    assert json['username'] == 'talw'
    assert json['preferences']['color'] == 'red'

def test_user_add_duplicate():
    """--> Test trying to add a duplicate"""
    user_json = {'username': "talw",
                 'password': "testing",
                 'preferences': {'color': 'red'}}
    resp = get_response_with_auth('POST', URL + '/users', user_json)
    LOGGER.debug('Posted user add, status code is: ' + str(resp.status_code))
    if resp.status_code >= 400:
        LOGGER.debug('Response text = %s', resp.text)
    assert resp.status_code == 400

def test_user_edit_api_success():
    """--> Test edit API success"""
    update_json = {'username': 'tal_wittle',
                   'password': '*&#$#',
                   'preferences': {'color': 'orange'}}
    resp = get_response_with_auth('PUT', URL + '/user/' + str(added_id), update_json)
    assert resp.status_code == 200

def test_user_lookup_after_edit():
    """--> Test that the user edited can be read"""
    resp = get_response_with_auth('GET', URL + '/user/' + str(added_id))
    assert resp.status_code == 200
    json = resp.json()
    assert json['username'] == 'tal_wittle'
    assert json['preferences']['color'] == 'orange'

def test_invalid_user_edit():
    """--> Test that editing a user that does not exist fails"""
    update_json = {'username': 'tal_wittle',
                   'password': '*&#$#',
                   'preferences': {'color': 'orange'}}
    resp = get_response_with_auth('PUT', URL + '/user/10000', update_json)
    assert resp.status_code == 400

def test_missing_username_edit():
    """--> Test that editing data missing a username fails"""
    update_json = {'password': '*&#$#',
                   'preferences': {'color': 'orange'}}
    resp = get_response_with_auth('PUT', URL + '/user/10000', update_json)
    assert resp.status_code == 400

def test_users_lookup():
    """--> Test that you can get a list of users"""
    resp = get_response_with_auth('GET', URL + '/users')
    assert resp.status_code == 200
    json = resp.json()
    assert json[0]['username'] == 'testing' or json[1]['username'] == 'testing'

def test_user_delete():
    """--> Test that you can delete a user"""
    resp = get_response_with_auth('DELETE', URL + '/user/' + str(added_id))
    assert resp.status_code == 204

def test_invalid_user_delete():
    """--> Test that you cannot delete an invalid user"""
    resp = get_response_with_auth('DELETE', URL + '/user/10000')
    assert resp.status_code == 400
