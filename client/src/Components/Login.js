import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      email: '',
      statusU: undefined,
      statusP: undefined,
      statusE: undefined,
      userbase: {},
      moreInfo: {},
      returningUser: true,
      attempt: false,
      isLoading: false,
      isMounted: false,
      preventRender: false
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.clearAttempt = this.clearAttempt.bind(this)
    this.convertMonth = this.convertMonth.bind(this)
  }

  onChange(e) {
    let { value, name } = e.target
    let { username, returningUser, userbase } = this.state
    let status;

    const checkLogin = () => {
        if (name === 'username' &&
            userbase.hasOwnProperty(value)) {
            status = true;
        } else if (userbase.hasOwnProperty(username) &&
            userbase[username] === value) {
            status = true;
        } else if (value !== '') {
            status = false;
        } else {
            status = undefined;
        }
    }

    const checkSignup = () => {
        if (name === 'username' &&
            !userbase.hasOwnProperty(value) &&
            value.length > 4) {
            status = true;
        } else if (name === 'password' && value.length > 4) {
            status = true;
        } else if (name === 'email' && value !== '' && value.split('@').length === 2 && value.split('@')[1].split('.').length === 2 && value.split('@')[1].split('.')[1] === 'com') {
            status = true;
        } else if (value !== '') {
            status = false;
        } else {
            status = undefined;
        }
    }

    if (returningUser) { checkLogin() }
    else { checkSignup() }

    if (name === 'username') {
      this.setState({username: value, statusU: status, attempt: false})
    }
    else if (name === 'password') {
      this.setState({password: value, statusP: status, attempt: false})
    }
    else if (name === 'email') {
      this.setState({email: value, statusE: status, attempt: false})
    }
  }

  onSubmit(e) {

    let {
      username,
      email,
      statusU,
      statusP,
      statusE,
      returningUser } = this.state

    e.preventDefault()
    
    // Check for successful login
    if (statusU && statusP && returningUser) {
        email = this.state.moreInfo[username].email
        let creationDate = this.state.moreInfo[username].creationDate
        this.props.setUser(username, email, creationDate)
    // Check for successful sign-up
    } else if (statusU && statusP && statusE) {
        let { username, password, userbase, email } = this.state
        e.preventDefault()
  
        if (username === '' || password === '') { return }
        if (userbase.hasOwnProperty(username)) { return }

        let creationDate = new Date()
        creationDate = creationDate.toString().substring(0,15)
        axios.post('/api/users', {username, password, email, creationDate})
        this.props.setUser(username, email, creationDate)
    }
    this.setState({attempt: true})
  }

  loginSignup(switchTo) {
    if (switchTo === 'signup') {
      this.setState({returningUser: false, username: '', password: '', email: ''})
    } else {
      this.setState({returningUser: true, username: '', password: '', email: ''})
    }
  }

  clearAttempt() { this.setState({attempt: false}) }

  convertMonth(date) {
    let dateObj = {Jan: '1', Feb: '2', Mar: '3', Apr: '4', May: '5', Jun: '6', Jul: '7', Aug: '8', Sep: '9', Oct: '10', Nov: '11', Dec: '12'}
    return dateObj[date]
  }

  componentDidUpdate() {

    let {
      statusU,
      statusP,
      statusE,
      attempt } = this.state

    if (statusU && statusP && statusE && attempt) {
      this.setState({statusU: false, statusP: false, statusE: false, attempt: false})
    }

  }

  componentDidMount() {
    this.setState({statusU: false, statusP: false, statusE: false, attempt: false, isLoading: true})
    axios
        .get('/api/users')
        .then(res => {
            console.log('users')
            let userbase = {}
            let moreInfo = {}
            res.data.forEach(user => {
              let date = user.creationDate.split(' ')
              userbase[user.username] = user.password
              moreInfo[user.username] = {email: user.email, creationDate: `${this.convertMonth(date[1])}/${date[2]}/${date[3].slice(2)}`}
            })
            this.setState({userbase, moreInfo, isLoading: false})
    })
  }

  render() {
    let { onChange, onSubmit } = this
    let {
      statusU,
      statusP,
      statusE,
      returningUser,
      password,
      email,
      username,
      attempt } = this.state

    let options;
    let emailInput;
    let colorF, colorU, colorP, colorE, validE, validU, validP;
    let styles = ['black','red', 'lime']

    if (statusU === undefined) { colorU = styles[0] }
    else if (statusU === false) { colorU = styles[1] }
    else if (statusU) { colorU = styles[2] }

    if (statusP === undefined) { colorP = styles[0] }
    else if (statusP === false) { colorP = styles[1] }
    else if (statusP) { colorP = styles[2] }

    if (statusE === undefined) { colorE = styles[0] }
    else if (statusE === false) { colorE = styles[1] }
    else if (statusE) { colorE = styles[2] }

    if (attempt && !statusU) validU = '1px solid red'
    else validU = 'none'

    if (attempt && !statusE) validE = '1px solid red'
    else validE = 'none'

    if (attempt && !statusP) validP = '1px solid red'
    else validP = 'none'

    if (returningUser) {
      colorF = '#FBFBFB'
      emailInput = '';
      options = (
        <p>Don't have an account? <span className='options opb' onClick={() => this.loginSignup('signup')}>Sign up</span></p>
      )
    } else {
      colorF = '#FFF7E7'
      emailInput = (
        <label style={{border: validE}}>
          <p>Email</p>
          <input name='email' style={{outlineColor: colorE}} onChange={onChange} />
        </label>
      )
      options = (
        <p>Already have an account? <span className='options opb' value={email} onClick={() => this.loginSignup('login')}>Login</span></p>
      )
    }

    return (
      <div id="login">
        <form id='loginForm' onSubmit={onSubmit} name='' style={{backgroundColor: colorF}}>
          {emailInput}
          <label style={{border: validU}}>
            <p>Username</p>
            <input name='username' style={{outlineColor: colorU}} value={username} onChange={onChange} />
          </label>
          <label style={{border: validP}}>
            <p>Password</p>
            <input name='password' style={{outlineColor: colorP}} value={password} onChange={onChange} id='pass' />
          </label>
          <button>{returningUser ? 'LOGIN' : 'SIGN UP'}</button>
          {options}
        </form>
      </div>
    )
  }
}

export default Login;
