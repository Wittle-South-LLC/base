/* Home.jsx - home page for users who are not authenticated */
import React from 'react'
import { intlShape, defineMessages } from 'react-intl'

export default class Home extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.componentText = defineMessages({
      pageName: { id: 'Home.pageName', defaultMessage: 'Hello World!' }
    })
  }
  render () {
    return (
      <div>
        {this.props.children}
        <p>{this.context.intl.formatMessage(this.componentText.pageName)}</p>
      </div>
    )
  }
}

Home.contextTypes = {
  intl: intlShape
}
