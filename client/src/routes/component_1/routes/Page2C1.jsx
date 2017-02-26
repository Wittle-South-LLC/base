/* Page2C1.jsx - Root component for application */
import React from 'react'
import { intlShape, defineMessages } from 'react-intl'

export default class Page2C1 extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.componentText = defineMessages({
      pageName: { id: 'Page2C1.pageName', defaultMessage: 'Page 2 - C1' }
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

Page2C1.contextTypes = {
  intl: intlShape
}
