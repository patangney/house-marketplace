import { useState } from 'react'
import { getAuth, updateProfile  } from 'firebase/auth'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Profile () {
  const auth = getAuth()

  const [changeDetails, setChangeDetails] = useState(false)

  const [formData, setFormData] = useState({
    userName: auth.currentUser.displayName,
    userEmail: auth.currentUser.email
  }) //set to null to check if there is a user

  const { userName, userEmail } = formData //take the info out and store in a obj

  const onSubmit = async () => {
    try {
      if(auth.currentUser.displayName !==userName){
        // Update display name in fb
        await updateProfile(auth.currentUser, {
          displayName: userName
        })
        // then update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await toast.promise(updateDoc(userRef, {userName}),{pending: 'Please wait', success: 'Updated'})

        
        /** @TODO Update userEmail address */

        
      }
      
      
    } catch (error) {
      console.log(error)
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,

    }))

  }

  const navigate = useNavigate()
  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button className='logOut' onClick={onLogout}>
          Log Out
        </button>
      </header>
      <main>
        <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>Personal Details</p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              changeDetails && onSubmit()
              setChangeDetails(prevState => !prevState)
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>
        <div className='profileCard'>
          <form>
            <input
              type='text'
              id='userName'
              className={!changeDetails ? 'profileName' : 'profileNameActive mb-2'}
              disabled={!changeDetails}
              value={userName}
              onChange={onChange}
            />
            <input
              type='text'
              id='userEmail'
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive mb-2'}
              disabled={!changeDetails}
              value={userEmail}
              onChange={onChange}
            />
          </form>
        </div>
      </main>
    </div>
  )
}

export default Profile
