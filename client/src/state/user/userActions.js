/* userActions.js - User actions */
import { fetchReduxAction, setNewPath } from '../fetchStatus/fetchStatusActions'

export const LOGIN_USER = 'LOGIN_USER'

export function loginUser (username, password, nextPath = undefined) {
  return (dispatch, getState) => {
    if (!getState().hasIn(['user', 'fetchingUser'])) {
      let payload = {
        apiUrl: '/login',
        method: 'GET',
        type: LOGIN_USER,
        sendData: { username }
      }
      return dispatch(fetchReduxAction(payload, username, password, nextPath))
    } else {
      if (nextPath) {
        return dispatch(setNewPath(nextPath))
      } else {
        return Promise.resolve()
      }
    }
  }
}
