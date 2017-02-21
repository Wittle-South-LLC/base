/* Home.jsx - home page for users who are not authenticated */
import React from 'react'
import { Button } from 'react-bootstrap'

export default class Home extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.doUser = this.doUser.bind(this)
    this.doComponent1 = this.doComponent1.bind(this)
  }
  doUser () {
    this.context.router.push('/user')
  }
  doComponent1 () {
    this.context.router.push('/component_1')
  }
  render () {
    return (
      <div>
        <p>Hello World!</p>
        <Button onClick={this.doUser}>User Stuff</Button>
        <Button onClick={this.doComponent1}>Component 1</Button>
      </div>
    )
  }
}

Home.contextTypes = {
  router: React.PropTypes.object
}
