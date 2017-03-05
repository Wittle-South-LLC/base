/* Register.jsx - Implements registration page */
import React from 'react'
import { intlShape, defineMessages } from 'react-intl'

export default class Register extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.componentText = defineMessages({
      pageName: { id: 'Register.pageName', defaultMessage: 'Please register' }
    })
  }
  render () {
    return (
      <div>
        <p>{this.context.intl.formatMessage(this.componentText.pageName)}</p>
      </div>
    )
  }
}

Register.contextTypes = {
  intl: intlShape
}
