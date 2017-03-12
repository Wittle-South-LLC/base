// Container.jsx - The application container for the top level route
import React from 'react'
import { Grid, Row } from 'react-bootstrap'
import SiteMenu from './components/SiteMenu'
import { setMessage } from './state/fetchStatus/fetchStatusActions'
import { intlShape, defineMessages } from 'react-intl'

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
  constructor (props, context) {
    super(props, context)

    // Method passed to store.subscribe, is called for each state change
    this.listenStore = this.listenStore.bind(this)
    this.init = this.init.bind(this)

    // Will be set when subscribe is called
    this.unsubscribe = undefined

    // Define the localized messages owned by this component
    this.componentText = defineMessages({
      navHomeLink: { id: 'container.home_link', defaultMessage: 'Home' },
      navUserLink: { id: 'container.user_link', defaultMessage: 'User' },
      navComponent1Link: { id: 'container.component_1_link', defaultMessage: 'Component 1' },
      enLocaleDesc: { id: 'container.en_locale_description', defaultMessage: 'English' },
      frLocaleDesc: { id: 'container.fr_locale_description', defaultMessage: 'French' },
      containerGreetingStatus: {
        id: 'container.greeting_status',
        defaultMessage: 'Simple and effective structure for applications'
      },
      containerTitle: {
        id: 'container.title',
        defaultMessage: 'Application Structure Playground'
      }
    })
    // Set the initial status message for newly activated application
//    setMessage('Simple and effective structure for applications')
    this.props.route.store.dispatch(setMessage(this.componentText.containerGreetingStatus))

    // Initialize the state to the current store state
    this.state = {
      reduxState: props.route.store.getState()
    }
    this.currentLocale = props.route.getCurrentLocale()
    this.init()
  }
  // Put the Redux state and dispatch method into context
  getChildContext () {
    return {
      reduxState: this.props.route.store.getState(),
      dispatch: this.props.route.store.dispatch
    }
  }
  init () {
    // Define the locales we will support; needs to be done in render because locale can change
    this.availableLocales = [
      {localeCode: 'en', localeDesc: this.context.intl.formatMessage(this.componentText.enLocaleDesc)},
      {localeCode: 'fr', localeDesc: this.context.intl.formatMessage(this.componentText.frLocaleDesc)}
    ]

    // Define the site-level navigation options that correspond to the routes shown above; needs to be done
    // in render because locales can change
    this.navOptions = [
      { path: process.env.URL_ROOT + '/home', class: 'home', label: this.context.intl.formatMessage(this.componentText.navHomeLink) },
      { path: process.env.URL_ROOT + '/user', class: 'user', label: this.context.intl.formatMessage(this.componentText.navUserLink) },
      { path: process.env.URL_ROOT + '/component_1', label: this.context.intl.formatMessage(this.componentText.navComponent1Link) }
    ]
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
    // If the state update contains a route transition, execute it
    if (this.props.route.store.getState().hasIn(['fetchStatus', 'transitionTo'])) {
      this.context.router.push(this.props.route.store.getState().getIn(['fetchStatus', 'transitionTo']))
    }
    this.setState({
      reduxState: this.props.route.store.getState()
    })
  }
  // Render the container and its children
  render () {
    let locale = this.props.route.getCurrentLocale()
    if (locale !== this.currentLocale) {
      this.currentLocale = locale
      this.init()
    }
    return (
      <SiteMenu title={this.context.intl.formatMessage(this.componentText.containerTitle)}
                navOptions={this.navOptions}
                availableLocales={this.availableLocales}
                changeLocale={this.props.route.changeLocale}
                currentLocale={locale}
                messageType={this.state.reduxState.getIn(['fetchStatus', 'messageType'])}
                message={this.context.intl.formatMessage(this.state.reduxState.getIn(['fetchStatus', 'message']))}>
        <Grid fluid={true} id="appName">
          <Row>
            {this.props.children}
          </Row>
        </Grid>
      </SiteMenu>
    )
  }
}

/*
    <div className='fullwidth'>
      <SiteMenu />
      <div className={this.state.contentClass}>
        <a className="button" onClick={this.onMenuToggle}></a>
        <h1>Baseline Project</h1>
        <h2>Simple and effective structure for applications</h2>
        <Grid fluid={true} id="appName">
          <h4>Container Grid</h4>
          {this.props.children}
        </Grid>
      </div>
    </div>
*/

Container.contextTypes = {
  intl: intlShape.isRequired,
  router: React.PropTypes.object
}

// Define the types of child context the container will produce
Container.childContextTypes = {
  dispatch: React.PropTypes.func,
  reduxState: React.PropTypes.object
}
