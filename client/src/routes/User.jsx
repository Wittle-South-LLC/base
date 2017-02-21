/* User.jsx - Root component for application */
import React from 'react'
import { Button } from 'react-bootstrap'

export default class User extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.doHome = this.doHome.bind(this)
    this.doComponent1 = this.doComponent1.bind(this)
  }
  doHome () {
    this.context.router.push('/home')
  }
  doComponent1 () {
    this.context.router.push('/component_1')
  }
  render () {
    return (
      <div>
        <p>User Page</p>
        <Button onClick={this.doHome}>Go Home</Button>
        <Button onClick={this.doComponent1}>Component 1</Button>
      </div>
    )
  }
}

User.contextTypes = {
  router: React.PropTypes.object
}
