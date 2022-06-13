import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getAuth,  
  signInWithEmailAndPassword
} from 'firebase/auth'
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignIn () {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { email, password } = formData
  const navigate = useNavigate()

  const onChange = e => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onSubmit = e => {
    e.preventDefault()
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user
        if(user) {
          navigate('/')
        }
        // ...
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
        
        const userNotFound = 'User Not Found'
        if(errorCode === 'auth/user-not-found') {
          toast(userNotFound)
        }
        
        console.log('error code ', errorCode)
        console.log('error message ', errorMessage)
        // ..
      })
  }

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome Back!</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <input
              type='email'
              className='emailInput'
              placeholder='Email'
              id='email'
              value={email}
              onChange={onChange}
            />
            <div className='passwordInputDiv'>
              <input
                type={showPassword ? 'text' : 'password'}
                className='passwordInput'
                placeholder='Password'
                id='password'
                value={password}
                onChange={onChange}
              />
              <img
                src={visibilityIcon}
                alt='show password'
                className='showPassword'
                onClick={() => setShowPassword(prevState => !prevState)}
              />
            </div>
            <Link to='/forgot-password' className='forgotPasswordLink'>
              Forgot Password
            </Link>

            <div className='signInBar'>
              <p className='signInText'>Sign In</p>
              <button className='signInButton'>
                <ArrowRightIcon fill='#ffffff' height='34px' width='34px' />
              </button>
            </div>
          </form>
          {/* TODO Google OAuth component*/}

          <Link to='/sign-up' className='registerLink'>
            Sign Up Instead
          </Link>
        </main>
      </div>
    </>
  )
}

export default SignIn
