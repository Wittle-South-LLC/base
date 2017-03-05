import { Map } from 'immutable'
import { ADD_ONE } from './testStuffActions'

export function testStuff (state = Map({ testCount: 0 }), action) {
  switch (action.type) {
    case ADD_ONE:
      let newState = state.set('testCount', state.get('testCount') + 1)
      return newState
    default: return state
  }
}
