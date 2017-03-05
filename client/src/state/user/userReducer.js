import { Map } from 'immutable'
import { LOGIN_USER } from './userActions'
import { FETCH_START, FETCH_ERROR, FETCH_SUCCESS } from '../fetchStatus/fetchStatusActions'

export function user (state = Map({ username: undefined, token: undefined }), action) {
  switch (action.type) {
    case LOGIN_USER:
      switch (action.status) {
        case FETCH_START: return state.set('fetchingUser', true).set('username', action.sendData.username)
        case FETCH_ERROR: return state.delete('fetchingUser').set('username', undefined)
        case FETCH_SUCCESS:
          return state.delete('fetchingUser').set('token', action.receivedData.token)
        default: return state
      }
    default: return state
  }
}
