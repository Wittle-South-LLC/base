"""test-authorize.py - Tests authorization APIs"""
import os.path
import logging
import requests
from requests.auth import HTTPBasicAuth
from .TestUtil import get_response_with_auth

# Set up logger
LOGGER = logging.getLogger()

# Get root of API URL
URL = os.environ['API_ROOT']
LOGGER.debug('url = ' + URL)

# Set a variable to store token
test_token = ''

def test_user_auth():
    """AuthorizeAPIs: Get a token for a person"""
    #pylint: disable=C0103,W0603
    global test_token
    resp = get_response_with_auth('GET', URL + '/token')
    if resp.json():
        LOGGER.debug("Auth token: " + resp.json()['token'])
    assert resp.status_code == 200
    test_token = resp.json()['token']

def test_auth_bad_password():
    """--> Get a token with bad password"""
    resp = requests.get(URL + '/token', auth=HTTPBasicAuth('testing', 'unused'))
    if resp.status_code >= 400:
        LOGGER.debug('Response.text = %s', resp.text)
    assert resp.status_code == 401

def test_auth_with_token():
    """--> Get a token using a token for authorization"""
    resp = requests.get(URL + '/token', auth=HTTPBasicAuth(test_token, 'unused'))
    if resp.status_code >= 400:
        LOGGER.debug('Response.text = %s', resp.text)
    assert resp.status_code == 200

def test_user_login():
    """--> Test user login"""
    resp = get_response_with_auth('GET', URL + '/login')
    assert resp.status_code == 200

def test_facebook_login_no_token():
    """--> Test facebook login with no access_token"""
    resp = get_response_with_auth('POST', URL + '/fb_login')
    assert resp.status_code == 401

def test_facebook_login_invalid():
    """--> Test facebook login with invalid token for code coverage"""
    facebook_stuff = {'access_token': 'junk'}
    resp = get_response_with_auth('POST', URL + '/fb_login', facebook_stuff)
    assert resp.status_code == 401

def test_facebook_no_access_token():
    """--> Test facebook login with json but no access token"""
    facebook_stuff = {'nothing': 'nothing'}
    resp = get_response_with_auth('POST', URL + '/fb_login', facebook_stuff)
    assert resp.status_code == 401
