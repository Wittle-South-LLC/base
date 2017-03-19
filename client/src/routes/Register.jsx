/* Register.jsx - Implements registration page */
import React from 'react'
import { Col, ControlLabel, Form, FormControl, FormGroup, Row } from 'react-bootstrap'
import PanelHeader from '../components/PanelHeader'
import { intlShape, defineMessages } from 'react-intl'
import { registerUser } from '../state/user/userActions'
import './Login.css'

export default class Register extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.registerUser = this.registerUser.bind(this)
    this.validInput = this.validInput.bind(this)
    this.state = {
      passwordError: false,
      emailError: false
    }
    this.componentText = defineMessages({
      olsSignupHeader: { id: 'Register.olsSignupHeader', defaultMessage: 'Sign up for an OurLifeStories.net account' },
      olsSignupUsernameLabel: { id: 'Register.olsSignupUsernameLabel', defaultMessage: 'Username:' },
      olsSignupUsernamePlaceholder: { id: 'Register.olsSignupUsernamePlaceholder', defaultMessage: 'User Name...' },
      olsSignupEmailLabel: { id: 'Register.olsSignupEmailLabel', defaultMessage: 'Email Address:' },
      olsSignupEmailPlaceholder: { id: 'Register.olsSignupEmailPlaceholder', defaultMessage: 'email...' },
      olsSignupPassword1Label: { id: 'Register.olsSignupPassword1Label', defaultMessage: 'Enter Password:' },
      olsSignupPassword1Placeholder: { id: 'Register.olsSignupPassword1Placeholder', defaultMessage: 'At least 8 chars with a number and special character' },
      olsSignupPassword2Label: { id: 'Register.olsSignupPassword2Label', defaultMessage: 'Repeat Password: ' },
      olsSignupPassword2Placeholder: { id: 'Register.olsSignupPassword2Placeholder', defaultMessage: 'Repeat Password...' },
      olsSignupInstructions: { id: 'Register.olsSignupInstructions', defaultMessage: 'Please create a username and password' }
    })
  }
  registerUser (e) {
    if (this.validInput()) {
      this.context.dispatch(registerUser(document.registerForm.userName.value,
                                         document.registerForm.password1.value,
                                         document.registerForm.emailAddress.value, '/home/login'))
      console.log('Register user')
    } else {
      console.log('Not registering user - invalid input')
    }
    e.preventDefault()
  }
  validInput () {
    // Make sure email address seems valid
    // Got the e-mail regext from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let emailError = !re.test(document.registerForm.emailAddress.value)
    console.log('emailError = ', emailError)

    // Ensure the password meets our standards
    let passwordRe = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/
    let passwordError = !passwordRe.test(document.registerForm.password1.value) ||
                        document.registerForm.password1.value !== document.registerForm.password2.value
    console.log('passwordError = ', passwordError)
    this.setState({
      passwordError: passwordError,
      emailError: emailError
    })
    return !emailError && !passwordError
  }
  render () {
    let formatMessage = this.context.intl.formatMessage
    return (
      <Row>
        <Col md={12}>
         <Form onSubmit={this.registerUser} name='registerForm'>
          <div className='panel panel-default'>
            <PanelHeader>
              <span className='panelTitle'>{formatMessage(this.componentText.olsSignupHeader)}</span>
              <span className='glyphicon glyphicon-save pull-right' onClick={this.registerUser}></span>
            </PanelHeader>
            <div className='panel-body'>
              <Col md={6}>
                <ControlLabel>{formatMessage(this.componentText.olsSignupUsernameLabel)}</ControlLabel>
                <FormControl
                  type='text'
                  id='userName'
                  placeholder={formatMessage(this.componentText.olsSignupUsernamePlaceholder)}/>
              </Col>
              <Col md={6}>
                <FormGroup validationState={this.state.passwordError ? 'error' : undefined}>
                  <ControlLabel>{formatMessage(this.componentText.olsSignupPassword1Label)}</ControlLabel>
                  <FormControl
                    type='password'
                    id='password1'
                    placeholder={formatMessage(this.componentText.olsSignupPassword1Placeholder)}/>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup validationState={this.state.emailError ? 'error' : undefined}>
                  <ControlLabel>{formatMessage(this.componentText.olsSignupEmailLabel)}</ControlLabel>
                  <FormControl
                    type='text'
                    id='emailAddress'
                    placeholder={formatMessage(this.componentText.olsSignupEmailPlaceholder)}/>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup validationState={this.state.passwordError ? 'error' : undefined}>
                  <ControlLabel>{formatMessage(this.componentText.olsSignupPassword2Label)}</ControlLabel>
                  <FormControl
                    type='password'
                    id='password2'
                    placeholder={formatMessage(this.componentText.olsSignupPassword2Placeholder)}/>
                </FormGroup>
              </Col>
              <input type="submit" id="hiddenSubmit"/>
              <div className='loginInstructions'>{formatMessage(this.componentText.olsSignupInstructions)}</div>
            </div>
          </div>
         </Form>
        </Col>
      </Row>
    )
  }
}

Register.contextTypes = {
  dispatch: React.PropTypes.func,
  intl: intlShape
}
