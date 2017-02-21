// Container.jsx - The application container for the top level route
import React from 'react'
import { Grid } from 'react-bootstrap'

/* Container will receive the Redux store via props, and will set
 * its state to the current store. The container also puts the
 * redux state in context, along with the dispatch method. Finally,
 * it subscribes to store updates, and resets its state based on
 * those updates. The state reset should trigger an update throughout
 * the route tree, and the current state and dispatch method can be
 * pulled from the context by any component that is a child of the
 * container (which should be all of them if the routes are built
 * correctly) */
export default class Container extends React.Component {
  constructor (props) {
    super(props)
    // Method passed to store.subscribe, is called for each state change
    this.listenStore = this.listenStore.bind(this)
    // Will be set when subscribe is called
    this.unsubscribe = undefined
    // Initialize the state to the current store state
    this.state = {
      reduxState: props.route.store.getState()
    }
  }
  // Put the Redux state and dispatch method into context
  getChildContext () {
    return {
      reduxState: this.props.route.store.getState(),
      dispatch: this.props.route.store.dispatch
    }
  }
  // After Container mounts initially, subscribe to store updates
  // and save the unsubscribe callback for when the component is
  // going to be unmounted
  componentDidMount () {
    this.unsubscribe = this.props.route.store.subscribe(this.listenStore)
  }
  // During unmount, unsubscribe from the redux store
  componentWillUnmount () {
    if (this.unsubscribe) { this.unsubscribe() }
  }
  // Callback method to receive state updates
  listenStore () {
    this.setState({
      reduxState: this.props.route.store.getState()
    })
  }
  // Render the container and its children
  render () {
    return (
      <Grid fluid={true} id="appName">
        <h4>Container Grid</h4>
        {this.props.children}
      </Grid>
    )
  }
}

// Define the types of child context the container will produce
Container.childContextTypes = {
  reduxState: React.PropTypes.object,
  dispatch: React.PropTypes.func
}
