/* fetchStatusReducer.js - reducer for fetch status */
import { Map } from 'immutable'
import { SET_MESSAGE, FETCH_START, FETCH_SUCCESS, FETCH_ERROR } from './fetchStatusActions'

export function fetchStatus (state = Map({ fetching: false, message: undefined }), action) {
  if (action.type === SET_MESSAGE) {
    return state.set('message', action.message).set('messageType', action.messageType)
  } else {
    switch (action.status) {
      case FETCH_START:
        return state.set('fetching', true)
      case FETCH_SUCCESS:
        return state.set('fetching', false)
      case FETCH_ERROR:
        if (process.env.MESSAGE_LEVEL === 'debug') {
          console.log('FETCH_ERROR being handled with message: ', action.message)
        }
        return state.set('fetching', false)
                    .set('message', action.message)
                    .set('messageType', 'error')
      default: return state
    }
  }
}
