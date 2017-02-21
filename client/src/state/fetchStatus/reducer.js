import { Map } from 'immutable'

export function fetchStatus (state = Map({ fetching: false, message: undefined }), action) {
  switch (action.status) {
    default: return state
  }
}
