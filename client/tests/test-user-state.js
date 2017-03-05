/* test-user-state.js - Tests user state */
import { fromJS } from 'immutable'
import { describe, it, afterEach } from 'mocha'
import { combineReducers } from 'redux-immutable'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import nock from 'nock'
import expect from 'expect'
import { isd, testAsync } from './TestUtils'
import { loginUser } from '../src/state/user/userActions'
import { user } from '../src/state/user/userReducer'
import { fetchStatus } from '../src/state/fetchStatus/fetchStatusReducer'

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
const stateLoginStart = initialState.setIn(['user', 'fetchingUser'], true)
                                    .setIn(['fetchStatus', 'fetching'], true)
                                    .setIn(['user', 'username'], 'testing')
const stateLoginSuccess = initialState.setIn(['user', 'username'], 'testing')
                                      .setIn(['user', 'token'], 'token')

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
})

