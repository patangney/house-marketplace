import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom';

function Profile () {
  const auth = getAuth()
  const [user, setUser] = useState({
    userName: auth.currentUser.displayName,
    email: auth.currentUser.email

  }) //set to null to check if there is a user

  const navigate = useNavigate()
  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }
  
  return <div className='profile'>
    <header className="profileHeader">
      <p className="pageHeader">My Profile</p>
      <button className="logout" onClick={onLogout}>

      </button>
    </header>
  </div>
}

export default Profile


