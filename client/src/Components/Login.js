import React, { useState } from 'react';
import axios from 'axios'

const Login = (props) => {
    let emailInput = ''
    let options = ''

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [userView, setUserView] = useState(true)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = e => {
      const { value, name } = e.target
      let resetError = {...errors}
      resetError[name] = ''
      setErrors(resetError)

      if (name === 'username') setUsername(value)
      else if (name === 'password') setPassword(value)
      else setEmail(value)
    }

    const creationDateStamp = () => {
      let creationDate = new Date().toString().substring(0,15)
      let date = creationDate.split(' ')
      let dateObj = {Jan: '1', Feb: '2', Mar: '3', Apr: '4', May: '5', Jun: '6', Jul: '7', Aug: '8', Sep: '9', Oct: '10', Nov: '11', Dec: '12'}
      return `${dateObj[date[1]]}/${date[2]}/${date[3].slice(2)}`
    }

    const handleSubmit = async e => {
      e.preventDefault()

      console.log(creationDateStamp())

      let userInfo = {
        username,
        password,
        email,
        creationDate: creationDateStamp()
      }

      setLoading(true)

      if (userView) {

        axios
          .post(`${process.env.REACT_APP_API}/api/users/login`, { userInfo })
          .then((res) => {
            localStorage.setItem("token", res.data.token)
            props.setUser(res.data.username, res.data.email, res.data.creationDate, res.data.settings)
          })
          .catch(err => {
            setErrors(err.response.data.errors)
            setLoading(false)
          })
          
      } 
      else {

        axios
          .post(`${process.env.REACT_APP_API}/api/users/signup`, { userInfo })
          .then((res) => {
            localStorage.setItem("token", res.data.token)
            props.setUser(username, email, userInfo.creationDate)
          })
          .catch(err => {
            setErrors(err.response.data.errors)
            setLoading(false)
          })

      }
    }

    const switchView = () => { 
      setUserView(!userView) 
      setUsername('')
      setPassword('')
      setEmail('')
      setErrors({})
    }

    const emailStyle = errors.hasOwnProperty('email') && errors.email ? { border: '1px solid red' } : { border: 'none' }
    const usernameStyle = errors.hasOwnProperty('username') && errors.username ? { border: '1px solid red' } : { border: 'none' }
    const passwordStyle = errors.hasOwnProperty('password') && errors.password ? { border: '1px solid red' } : { border: 'none' }

    const emailText = errors.hasOwnProperty('email') && errors.email ? errors.email : ''
    const passwordText = errors.hasOwnProperty('password') && errors.password ? errors.password : ''
    const usernameText = errors.hasOwnProperty('username') && errors.username ? errors.username : ''

    if (userView) options = <p>Don't have an account? <span className='options opb' onClick={switchView}>Sign up</span></p>
    else {
      emailInput = (
        <label style={emailStyle}>
          <p>Email</p>
          <input name='email' onChange={handleChange} />
          <div className='errors'>{emailText}</div>
        </label>
      )
      options = <p>Already have an account? <span className='options opb' value={email} onClick={switchView}>Login</span></p>
    }

    return (
      <div id="login">
        {loading ? <div className='loading'><div className='loader'></div></div> : ''}
        <form id='loginForm' onSubmit={handleSubmit} name=''>
          {emailInput} 
          <label style={usernameStyle}>
            <p>Username</p>
            <input name='username' value={username} onChange={handleChange} />
            <div className='errors'>{usernameText}</div>
          </label>
          <label style={passwordStyle}>
            <p>Password</p>
            <input name='password' type='password' value={password} onChange={handleChange} id='pass' />
            <div className='errors'>{passwordText}</div>
          </label>
          <button>{userView ? 'LOGIN' : 'SIGN UP'}</button>
          {options}
        </form>
      </div>
    )
}

export default Login;
