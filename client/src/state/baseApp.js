/* baseApp.js - Application reducer for redux state */
import { combineReducers } from 'redux-immutable'
import { fetchStatus } from './fetchStatus/fetchStatusReducer'
import { testStuff } from './testStuff/testStuffReducer'

const baseApp = combineReducers({
  fetchStatus,
  testStuff
})

export default baseApp
