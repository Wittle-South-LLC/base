/* User.jsx - Root component for application */
import React from 'react'
import { intlShape, defineMessages } from 'react-intl'

export default class User extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.componentText = defineMessages({
      pageName: { id: 'User.pageName', defaultMessage: 'User Page' }
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

User.contextTypes = {
  intl: intlShape
}
