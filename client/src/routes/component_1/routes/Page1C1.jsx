/* Page1C1.jsx - Root component for application */
import React from 'react'
import { Button } from 'react-bootstrap'

export default class Page1C1 extends React.Component {
  constructor (props) {
    super(props)
    this.addOne = this.addOne.bind(this)
  }
  addOne (e) {
    this.context.dispatch({type: 'ADD_ONE'})
  }
  render () {
    let { reduxState } = this.context
    return (
      <div>
        <p>Page 1 - C1</p>
        <p>Test Count = {reduxState.getIn(['testStuff', 'testCount'])}</p>
        <Button onClick={this.addOne}>Add One!</Button>
      </div>
    )
  }
}

Page1C1.contextTypes = {
  reduxState: React.PropTypes.object,
  dispatch: React.PropTypes.func
}
