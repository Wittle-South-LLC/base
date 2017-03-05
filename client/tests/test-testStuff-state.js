/* test-fetchStatus-state.js - Tests user state */
import { fromJS } from 'immutable'
import { describe, it } from 'mocha'
import { combineReducers } from 'redux-immutable'
import expect from 'expect'
import { isd } from './TestUtils'
import { addOne } from '../src/state/testStuff/testStuffActions'
import { testStuff } from '../src/state/testStuff/testStuffReducer'

// Here's the application (for this test anyway) reducer
const testTestStuffState = combineReducers({ testStuff })

// Set up the various state constants I'm going to use for testing, which
// are a potential walkthrough of a create/edit/lookup/delete sequence
// I assert I'm still following test independence, because these are
// all set up in advance and not side effects of other tests
const initialState = fromJS({
  testStuff: { testCount: 0 }
})
const stateAddedOne = initialState.setIn(['testStuff', 'testCount'], 1)

describe('testStuff: testing reducing of testStuff actions', () => {
  it('returns initial state', () => {
    expect(isd(testTestStuffState(undefined, {}), initialState)).toEqual(true)
  })
  it('adds one correctly', () => {
    expect(isd(testTestStuffState(initialState, addOne()), stateAddedOne)).toEqual(true)
  })
})
