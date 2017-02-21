/* index.jsx - Root component for application */
import React from 'react'
import ReactDOM from 'react-dom'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { browserHistory, Router, Route, IndexRedirect, Redirect } from 'react-router'
import baseApp from './state/baseApp'
import Container from './Container'
import Home from './routes/Home'
import User from './routes/User'
import Component1 from './routes/component_1/Component1'
import Page1C1 from './routes/component_1/routes/Page1C1'
import Page2C1 from './routes/component_1/routes/Page2C1'

export class App extends React.Component {
  constructor (props) {
    super(props)

    // Bind the two helper methods for dynamic loading of components
    this.lazyLoadComponent = this.lazyLoadComponent.bind(this)
    this.lazyLoadComponents = this.lazyLoadComponents.bind(this)

    // Establish the Redux store that will hold the data model
    // state for this application
    // --> baseApp is the root reducer
    // --> baseApp(undefined, {}) creates an initial state
    // --> thunkMiddleware allows us to use async functions as Redux actions
    this.store = createStore(baseApp,
                             baseApp(undefined, {}),
                             applyMiddleware(thunkMiddleware))

    // Define the routes for this app. The component associated with each
    // route will be loaded as the browser history is set to that route.
    // The webpack configuration file will establish chunks for the top
    // level routes, and we're going to dynamically load all of the components
    // except the initial container.
    this.routes =
      <Route path={'/'} component={Container} store={this.store}>
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
  }
  // Helper for lazy loading an individual component
  lazyLoadComponent (lazyModule) {
    return (location, cb) => {
      lazyModule(module => {
        cb(null, module.default)
      })
    }
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
      <Router history={browserHistory}>
        {this.routes}
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
