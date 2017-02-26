import { Map } from 'immutable'

export function setMessage (message) {
  return { type: 'SET_MESSAGE', message }
}

export function fetchStatus (state = Map({ fetching: false, message: undefined }), action) {
  if (action.type === 'SET_MESSAGE') {
    console.log('setting message to: ', action.message)
    return state.set('message', action.message)
  } else {
    switch (action.status) {
      default: return state
    }
  }
}
