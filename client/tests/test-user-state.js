/* test-user-state.js - Tests user state */
import { fromJS } from 'immutable'
import { describe, it, afterEach } from 'mocha'
import { combineReducers } from 'redux-immutable'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import nock from 'nock'
import expect from 'expect'
import { isd, testAsync } from './TestUtils'
import { listUsers, loginUser, registerUser } from '../src/state/user/userActions'
import { user, componentText as userComponentText } from '../src/state/user/userReducer'
import { fetchStatus } from '../src/state/fetchStatus/fetchStatusReducer'
import { componentText } from '../src/state/fetchStatus/fetchStatusActions'

// Here's the application (for this test anyway) reducer
const testUserState = combineReducers({ fetchStatus, user })

// Set up the various state constants I'm going to use for testing, which
// are a potential walkthrough of a create/edit/lookup/delete sequence
// I assert I'm still following test independence, because these are
// all set up in advance and not side effects of other tests
const initialState = fromJS({
  fetchStatus: { fetching: false, message: undefined },
  user: { token: undefined, username: undefined }
})

// Login states, starting fetch, success, and failed
const stateLoginStart = initialState.setIn(['user', 'fetchingUser'], true)
                                    .setIn(['fetchStatus', 'fetching'], true)
                                    .setIn(['user', 'username'], 'testing')
const stateLoginSuccess = initialState.setIn(['user', 'username'], 'testing')
                                      .setIn(['user', 'token'], 'token')
                                      .setIn(['fetchStatus', 'messageType'], 'status')
                                      .setIn(['fetchStatus', 'message'], userComponentText.userLogin)
const stateLoginFailed = initialState.setIn(['fetchStatus', 'message'], componentText.invalidCredentials)
                                     .setIn(['fetchStatus', 'messageType'], 'error')
// List user states starting from successful login state
const stateListUserStart = stateLoginSuccess.setIn(['user', 'list'], undefined)
                                            .setIn(['fetchStatus', 'fetching'], true)
const userList = [ { username: 'testing', preferences: {}, user_id: 1 } ]
const stateUsersListed = stateLoginSuccess.setIn(['user', 'list'], fromJS(userList))
// Create states starting from initialState
const stateRegisterStart = initialState.setIn(['user', 'creatingUser'], true)
                                       .setIn(['fetchStatus', 'fetching'], true)
const stateRegisterSuccess = initialState.setIn(['fetchStatus', 'message'], userComponentText.userCreated)
                                         .setIn(['fetchStatus', 'messageType'], 'status')
const stateRegisterFailed = initialState.setIn(['fetchStatus', 'message'], componentText.invalidRequest)
                                         .setIn(['fetchStatus', 'messageType'], 'error')
// Update states starting from successful created state
// Delete states starting from successful updated state

describe('user: testing reducing of synchronous actions', () => {
  it('returns initial state', () => {
    expect(isd(testUserState(undefined, {}), initialState)).toEqual(true)
  })
})

describe('user: testing reducing of asynchronous actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })
  it('handles loginUser with a successful response', (done) => {
    let store = createStore(testUserState, initialState, applyMiddleware(thunkMiddleware))
    const receivedData = {token: 'token'}
    nock(process.env.API_ROOT).get('/login').reply(200, receivedData)
    testAsync(store, stateLoginStart, stateLoginSuccess, done)
    store.dispatch(loginUser('testing', 'testing'))
  })
  it('handles loginUser with an unsuccessful response', (done) => {
    let store = createStore(testUserState, initialState, applyMiddleware(thunkMiddleware))
    nock(process.env.API_ROOT).get('/login').reply(401)
    testAsync(store, stateLoginStart, stateLoginFailed, done)
    store.dispatch(loginUser('testing', 'invalid password'))
  })
  it('handles listUsers with a successful response', (done) => {
    let store = createStore(testUserState, stateLoginSuccess, applyMiddleware(thunkMiddleware))
    nock(process.env.API_ROOT).get('/users').reply(200, userList)
    testAsync(store, stateListUserStart, stateUsersListed, done)
    store.dispatch(listUsers())
  })
  it('handles registerUser with a successful response', (done) => {
    let store = createStore(testUserState, initialState, applyMiddleware(thunkMiddleware))
    const receivedData = {id: 100}
    nock(process.env.API_ROOT).post('/users').reply(200, receivedData)
    testAsync(store, stateRegisterStart, stateRegisterSuccess, done)
    store.dispatch(registerUser('testing2', 'testing2', 'email'))
  })
  it('handles regsiterUser with an unsuccessful response', (done) => {
    let store = createStore(testUserState, initialState, applyMiddleware(thunkMiddleware))
    nock(process.env.API_ROOT).post('/users').reply(400)
    testAsync(store, stateRegisterStart, stateRegisterFailed, done)
    store.dispatch(registerUser('testing2', '', 'email'))
  })
})

