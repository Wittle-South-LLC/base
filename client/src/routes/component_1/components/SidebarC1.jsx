/* SidebarC1.jsx - Sidebar for C1 */
import React from 'react'
import { Button, Col } from 'react-bootstrap'
import { intlShape, defineMessages } from 'react-intl'

export default class SidebarC1 extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.onPage1Click = this.onPage1Click.bind(this)
    this.onPage2Click = this.onPage2Click.bind(this)
    this.onHomeClick = this.onHomeClick.bind(this)

    this.componentText = defineMessages({
      pageName: { id: 'SidebarC1.pageName', defaultMessage: 'Sidebar C1'},
      navPage1: { id: 'SidebarC1.navPage1', defaultMessage: 'Page 1' },
      navPage2: { id: 'SidebarC1.navPage2', defaultMessage: 'Page 2' }
    })
  }
  onPage1Click (e) {
    this.context.router.push('/component_1/Page1C1')
  }
  onPage2Click (e) {
    this.context.router.push('/component_1/Page2C1')
  }
  onHomeClick (e) {
    this.context.router.push('/home')
  }
  render () {
    return (
      <Col md={2}>
        <p>{this.context.intl.formatMessage(this.componentText.pageName)}</p>
        <Button onClick={this.onPage1Click}>{this.context.intl.formatMessage(this.componentText.navPage1)}</Button>
        <Button onClick={this.onPage2Click}>{this.context.intl.formatMessage(this.componentText.navPage1)}</Button>
      </Col>
    )
  }
}

SidebarC1.contextTypes = {
  router: React.PropTypes.object,
  intl: intlShape.isRequired
}
