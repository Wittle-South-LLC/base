/* Page1C1.jsx - Root component for application */
import React from 'react'
import { Button } from 'react-bootstrap'
import { intlShape, defineMessages } from 'react-intl'

export default class Page1C1 extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.addOne = this.addOne.bind(this)
    this.componentText = defineMessages({
      pageName: { id: 'Page1C1.pageName', defaultMessage: 'Page 1 - C1' },
      countMessage: { id: 'Page1C1.countMessage', defaultMessage: 'You have clicked {count, number} {count, plural, zero {times} one {time} other {times}}' },
      actionAddOne: { id: 'Page1C1.actionAddOne', defaultMessage: 'Add One!' }
    })
  }
  addOne (e) {
    this.context.dispatch({type: 'ADD_ONE'})
  }
  render () {
    let { reduxState } = this.context
    return (
      <div>
        <p>{this.context.intl.formatMessage(this.componentText.pageName)}</p>
        <p>{this.context.intl.formatMessage(this.componentText.countMessage, {count: reduxState.getIn(['testStuff', 'testCount'])})}</p>
        <Button onClick={this.addOne}>{this.context.intl.formatMessage(this.componentText.actionAddOne)}</Button>
      </div>
    )
  }
}

Page1C1.contextTypes = {
  reduxState: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  intl: intlShape
}
