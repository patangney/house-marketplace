import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignUp () {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: ''
    
  })

  const navigate = useNavigate()

  const { userName, email, password } = formData

  const onChange = e => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onSubmit = async e => {
    e.preventDefault()

    try {
      /**
       * Google OAuth - create new user
       */
      const auth = getAuth() /** @TODO change this to promise later */
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      updateProfile(auth.currentUser, {
        displayName: userName
      })

      /**
       * Copy Everything in @formData
       * delete password so that it is not store in database
       */
      const formDataCopy = {...formData}
      formDataCopy.userType = 'regular' /** @TODO | tagging records for admin section that will be implemented later */
      console.log(formDataCopy)
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()
      
      // update database to @users collection with user ID
      await setDoc(doc(db, 'users', user.uid), formDataCopy)
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Sign Up</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <input
              type='text'
              className='nameInput'
              placeholder='What is your name ?'
              id='userName'
              value={userName}
              onChange={onChange}
            />
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

            <div className='signUpBar'>
              <p className='signUpText'>Sign Up</p>
              <button className='signUpButton'>
                <ArrowRightIcon fill='#ffffff' height='34px' width='34px' />
              </button>
            </div>
          </form>
          {/* TODO Google OAuth component*/}

          <Link to='/sign-in' className='registerLink'>
            Sign In Instead
          </Link>
        </main>
      </div>
    </>
  )
}

export default SignUp
