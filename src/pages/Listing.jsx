import {useState, useEffect} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc, DocumentSnapshot } from 'firebase/firestore';
import {db} from '../firebase.config'
import { getAuth } from 'firebase/auth';
import Spinner from './../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg'



function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId) //getting id from url
      const docSnapshot = await getDoc(docRef)

      if(docSnapshot.exists()){
        console.log(docSnapshot)
        setListing(docSnapshot.data())
        setLoading(false)
      }
    }
    fetchListing()

  }, [navigate, params.listingId])

  return (
    /** @TODO SLIDER */
    
  )
}

export default Listing