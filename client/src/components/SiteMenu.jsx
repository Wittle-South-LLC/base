// SiteMenu.jsx - Implements a site-wide menu
import React from 'react'
import { intlShape, defineMessages } from 'react-intl'
import './SiteMenu.css'

export default class SiteMenu extends React.Component {
  constructor (props, context) {
    super(props)
    this.onMenuToggle = this.onMenuToggle.bind(this)
    this.onMenuClick = this.onMenuClick.bind(this)
    this.onSignInClick = this.onSignInClick.bind(this)
    this.onRegisterClick = this.onRegisterClick.bind(this)
    this.componentText = defineMessages({
      signInText: { id: 'SiteMenu.signInText', defaultMessage: 'Sign in' },
      orText: { id: 'SiteMenu.orText', defaultMessage: 'or' },
      registerText: { id: 'SiteMenu.registerText', defaultMessage: 'Register' }
    })
    this.state = {
      contentClass: 'content',
      activePath: process.env.URL_ROOT + '/home'
    }
  }
  onSignInClick (e) {
    this.setState({
      activePath: process.env.URL_ROOT + '/home/login'
    })
    this.context.router.push(process.env.URL_ROOT + '/home/login')
  }
  onRegisterClick (e) {
    this.setState({
      activePath: process.env.URL_ROOT + '/home/register'
    })
    this.context.router.push(process.env.URL_ROOT + '/home/register')
  }
  onMenuToggle (e) {
    this.state.contentClass === 'content'
      ? this.setState({ contentClass: 'content isOpen' })
      : this.setState({ contentClass: 'content' })
  }
  onMenuClick (path, e) {
    this.setState({
      activePath: path
    })
    this.context.router.push(path)
  }
  render () {
    // If the property navOptions is not empty, create a list of links
    let menuOptions = this.props.navOptions
      ? this.props.navOptions.map((option) =>
        <li key={option.path} className={option.class}>
          <a className={option.path === this.state.activePath ? 'active' : undefined}
             onClick={this.onMenuClick.bind(undefined, option.path)}>{option.label}</a>
        </li>)
      : []
    return (
      <div className="wsv-container">
        <div className="sidebar">
          <div className="title">Site Menu</div>
          <ul className="nav">
            {menuOptions}
          </ul>
        </div>
        <div className={this.state.contentClass}>
          <div className='titlebarRight'>
            <select className="languageSelect" onChange={this.props.changeLocale} value={this.props.currentLocale}>
              {this.props.availableLocales.map((locale) =>
                <option key={locale.localeCode} value={locale.localeCode}>{locale.localeDesc}</option>
              )}
            </select>
            <span onClick={this.onSignInClick} className='titlelink'>
              {this.context.intl.formatMessage(this.componentText.signInText)}
            </span>
            <span className='titleor'>
              {this.context.intl.formatMessage(this.componentText.orText)}
            </span>
            <span onClick={this.onRegisterClick} className='titlelink'>
              {this.context.intl.formatMessage(this.componentText.registerText)}
            </span>
          </div>
          <a className="button" onClick={this.onMenuToggle}></a>
          <span className='appTitle'>{this.props.title}</span>
          <div className={'appMessage ' + this.props.messageType}>
            {this.props.message}
          </div>
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
  router: React.PropTypes.object,
  intl: intlShape
}
