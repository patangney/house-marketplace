import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { getDoc, doc, DocumentSnapshot } from 'firebase/firestore'
import { db } from '../firebase.config'
import { getAuth } from 'firebase/auth'
import Spinner from './../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'

function Listing () {
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

      if (docSnapshot.exists()) {
        console.log(docSnapshot)
        setListing(docSnapshot.data())
        setLoading(false)
      }
    }
    fetchListing()
  }, [navigate, params.listingId])

  if (loading) {
    return <Spinner />
  }

  return (
    <main>
      {/** @TODO SLIDER */}
      <div
        className='shareIconDiv'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          setShareLinkCopied(true)
          setTimeout(() => {
            //set shared link
            setShareLinkCopied(false)
          }, 2000)
        }}
      >
        <img src={shareIcon} alt='' />
      </div>
      {shareLinkCopied && <p className='linkCopied'>Link Copied</p>}
      <div className='listingDetails'>
        <p className='listingName'>
          {listing.name} - €
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
        <p className='listingLocation'>{listing.location}</p>
        <p className='listingType'>
          For {listing.type === 'rent' ? 'Rent' : 'Sale'}
        </p>
        {listing.offer && (
          <p className='discountPrice'>
            €{listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}
        <ul className='listingDetailsList'>
          <li>{listing.bedrooms > 1 ? `${listing.bedrooms}` : '1 Bedroom'}</li>
          <li>
            {listing.bathrooms > 1 ? `${listing.bathrooms}` : '1 Bathroom'}
          </li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>
        <p className='listingLocationTitle'>Location</p>
        <div className='leafletContainer'>
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={15}
            scrollWheelZoom={true}
          >
            <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'  />
              <Marker position={[listing.geolocation.lat, listing.geolocation.lng]} title={listing.name} >
                <Popup>{listing.location}</Popup>
              </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`}
            className='primaryButton'
          >
            Contact Landlord
          </Link> //use this params to auto fill email
        )}
      </div>
    </main>
  )
}

export default Listing
