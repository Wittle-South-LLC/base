/* SidebarC1.jsx - Sidebar for C1 */
import React from 'react'
import { Button } from 'react-bootstrap'

export default class SidebarC1 extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.onPage1Click = this.onPage1Click.bind(this)
    this.onPage2Click = this.onPage2Click.bind(this)
    this.onHomeClick = this.onHomeClick.bind(this)
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
      <div>
        <p>Sidebar C1</p>
        <Button onClick={this.onPage1Click}>Page 1</Button>
        <Button onClick={this.onPage2Click}>Page 2</Button>
        <Button onClick={this.onHomeClick}>Home</Button>
      </div>
    )
  }
}

SidebarC1.contextTypes = {
  router: React.PropTypes.object
}
