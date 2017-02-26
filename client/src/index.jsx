/* index.jsx - Root component for application */
import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css'
import fetch from 'isomorphic-fetch'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { browserHistory, Router, Route, IndexRedirect, Redirect } from 'react-router'
import { IntlProvider, addLocaleData, defineMessages } from 'react-intl'
import fr from 'react-intl/locale-data/fr'
import baseApp from './state/baseApp'
import Container from './Container'
import Home from './routes/Home'
import User from './routes/User'
import Component1 from './routes/component_1/Component1'
import Page1C1 from './routes/component_1/routes/Page1C1'
import Page2C1 from './routes/component_1/routes/Page2C1'
import './index.css'

let defaultLocaleData = {}

export class App extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('App Context = ', context)

    // Bind the two helper methods for dynamic loading of components
    this.lazyLoadComponent = this.lazyLoadComponent.bind(this)
    this.lazyLoadComponents = this.lazyLoadComponents.bind(this)
    this.changeLocale = this.changeLocale.bind(this)
    this.loadLocale = this.loadLocale.bind(this)
    this.setLocale = this.setLocale.bind(this)
    this.getLocale = this.getLocale.bind(this)

    // Establish the Redux store that will hold the data model
    // state for this application
    // --> baseApp is the root reducer
    // --> baseApp(undefined, {}) creates an initial state
    // --> thunkMiddleware allows us to use async functions as Redux actions
    this.store = createStore(baseApp,
                             baseApp(undefined, {}),
                             applyMiddleware(thunkMiddleware))

    // Set a basic message to see if we're fucked for some unknown reason
    this.componentText = defineMessages({
      testMessage: { id: 'app.testMessage', defaultMessage: 'This is a another test' }
    })

    // Set the default locale in state
    this.state = {
      locale: 'en'
    }

    // Define the routes for this app. The component associated with each
    // route will be loaded as the browser history is set to that route.
    // The webpack configuration file will establish chunks for the top
    // level routes, and we're going to dynamically load all of the components
    // except the initial container.
    this.routes =
      <Route path={'/'}
             component={Container}
             store={this.store}
             changeLocale={this.changeLocale}
             getCurrentLocale={this.getLocale}>
        <IndexRedirect to={'/home'} />
        <Route path={'/home'} getComponent={ this.lazyLoadComponent(Home) } />
        <Route path={'/user'} getComponent={ this.lazyLoadComponent(User) } />
        <Route path={'/component_1'} getComponent={ this.lazyLoadComponent(Component1) } >
          <IndexRedirect to={'Page1C1'} />
          <Route path={'Page1C1'} getComponent={ this.lazyLoadComponent(Page1C1) } />
          <Route path={'Page2C1'} getComponent={ this.lazyLoadComponent(Page2C1) } />
        </Route>
        <Redirect from='*' to={'/home'} />
      </Route>

    this.localeData = defaultLocaleData
  }
  // Helper for lazy loading an individual component
  lazyLoadComponent (lazyModule) {
    return (location, cb) => {
      lazyModule(module => {
        cb(null, module.default)
      })
    }
  }
  loadLocale (loc) {
    let _self = this
    // This code should initialize the locale based on the actual locale
    fetch(`/lang/${loc}.json`)
      .then((res) => {
        if (res.status >= 400) {
          throw new Error('Bad response from server');
        }
        return res.json()
      })
      .then((localeData) => {
        if (loc === 'fr') {
          addLocaleData(fr)
        }
        _self.localeData = localeData
        this.setLocale(loc)
      }).catch((error) => {
        console.error(error)
      })
  }
  changeLocale (loc) {
    console.log('Changing locale to: ', loc.target.value)
    this.loadLocale(loc.target.value)
  }
  setLocale (loc) {
    this.setState({
      locale: loc
    })
  }
  getLocale () {
    return this.state.locale
  }
  // Helper for lazy loading a set of components
  // TODO: Actually test if this works - not using yet
  lazyLoadComponents (lazyModules) {
    return (location, cb) => {
      const moduleKeys = Object.keys(lazyModules)
      const promises = moduleKeys.map(key =>
        new Promise(resolve => lazyModules[key](resolve))
      )
      Promise.all(promises).then(modules => {
        cb(null, modules.reduce((obj, module, i) => {
          obj[moduleKeys[i]] = module
          return obj
        }, {}))
      })
    }
  }
  render () {
    return (
      <IntlProvider locale={this.state.locale} messages={this.localeData}>
        <Router history={browserHistory}>
          {this.routes}
        </Router>
      </IntlProvider>
    )
  }
}

/*
App.contextTypes = {
  intl: intlShape.isRequired
}
*/

fetch(`/lang/en.json`)
  .then((res) => {
    if (res.status >= 400) {
      throw new Error('Bad response from server')
    }
    return res.json()
  })
  .then((localeData) => {
    defaultLocaleData = localeData
  }).catch((error) => {
    console.error(error)
  })

ReactDOM.render(<App />, document.getElementById('app'))
