import { Map } from 'immutable'

export function testStuff (state = Map({ testCount: 0 }), action) {
  switch (action.type) {
    case 'ADD_ONE':
      let newState = state.set('testCount', state.get('testCount') + 1)
      return newState
    default: return state
  }
}
