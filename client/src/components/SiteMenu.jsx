// SiteMenu.jsx - Implements a site-wide menu
import React from 'react'
import './SiteMenu.css'

export default class SiteMenu extends React.Component {
  constructor (props, context) {
    super(props)
    this.onMenuToggle = this.onMenuToggle.bind(this)
    this.onMenuClick = this.onMenuClick.bind(this)
    this.state = {
      contentClass: 'content',
      activePath: '/home'
    }
  }
  onMenuToggle (e) {
    console.log('in onMenuToggle, contentClass = ', this.state.contentClass)
    this.state.contentClass === 'content'
      ? this.setState({ contentClass: 'content isOpen' })
      : this.setState({ contentClass: 'content' })
  }
  onMenuClick (path, e) {
    console.log('onMenuClick path = ', path)
    this.setState({
      activePath: path
    })
    this.context.router.push(path)
  }
  render () {
    // If the property navOptions is not empty, create a list of links
    let menuOptions = this.props.navOptions
      ? this.props.navOptions.map((option) =>
        <li key={option.path}>
          <a className={option.path === this.state.activePath ? 'active' : undefined}
             onClick={this.onMenuClick.bind(undefined, option.path)}>{option.label}</a>
        </li>)
      : []
    return (
      <div className="wrapper">
        <div className="sidebar">
          <div className="title">Site Menu</div>
          <ul className="nav">
            {menuOptions}
          </ul>
        </div>
        <div className={this.state.contentClass}>
          <div className='titlebarRight'>
            <select onChange={this.props.changeLocale} value={this.props.currentLocale}>
              {this.props.availableLocales.map((locale) =>
                <option key={locale.localeCode} value={locale.localeCode}>{locale.localeDesc}</option>
              )}
            </select>
            <span className='authenticateLink'>Sign In or Register</span>
          </div>
          <a className="button" onClick={this.onMenuToggle}></a>
          <h1>{this.props.title}</h1>
          <h2>{this.props.message}</h2>
          {this.props.children}
        </div>
      </div>
    )
  }
}

/*
      <div className="sidebar">
        <div className="title">Site Menu</div>
        <ul className="nav">
          <li><a>Dashboard</a></li>
          <li><a>Statistics</a></li>
          <li><a className="active">Milestones</a></li>
          <li><a>Experiments</a></li>
        </ul>
      </div>
*/

SiteMenu.contextTypes = {
  reduxState: React.PropTypes.object,
  router: React.PropTypes.object
}
