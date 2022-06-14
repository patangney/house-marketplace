import { useLocation, useNavigate } from 'react-router-dom'
import { db } from '../firebase.config'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import googleIcon from '../assets/svg/googleIcon.svg'
import { toast } from 'react-toastify'

function Oauth () {
    let userType = 'regular'
  const navigate = useNavigate()
  const location = useLocation()
  const onGoogleClick = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      //Check for user - if use doesn't exist, create user
      const docRef = doc(db, 'users', user.uid)
      const docSnapshot = await getDoc(docRef)

      if (!docSnapshot.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
            name: user.displayName,
            email: user.email,
            timestamp: serverTimestamp(),
            userType: userType
        })
      }
      navigate('/')
    } catch (error) {
        toast.error('Could not authorise with Google')
    }
  }

  return (
    <div className='socialLogin'>
      <p>Sign {location.pathname === '/sign-up' ? 'Up' : 'In'} with</p>
      <button className='socialIconDiv' onClick={onGoogleClick}>
        <img className='socialIconImg' src={googleIcon} alt='google' />
      </button>
    </div>
  )
}

export default Oauth
