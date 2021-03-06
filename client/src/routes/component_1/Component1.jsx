/* Component1.jsx - Testing my component approach */
import React from 'react'
import { Col } from 'react-bootstrap'
import SidebarC1 from './components/SidebarC1'

export default class extends React.Component {
  render () {
    // Pass state and dispatch on to children
/*
    let _self = this
    let children = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
      reduxState: _self.props.reduxState,
      dispatch: _self.props.dispatch
    }))
*/
    return (
      <div>
        <SidebarC1 />
        <Col md={10}>
          {this.props.children}
        </Col>
      </div>
    )
  }
}
