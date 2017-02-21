/* baseApp.js - Application reducer for redux state */
import { combineReducers } from 'redux-immutable'
import { fetchStatus } from './fetchStatus/reducer'
import { testStuff } from './testStuff/reducer'

const baseApp = combineReducers({
  fetchStatus,
  testStuff
})

export default baseApp
