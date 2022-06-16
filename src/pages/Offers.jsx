import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Offers () {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  const params = useParams()

  useEffect(() => {
    const fetchListing = async () => {
      try {
        // Get reference
        const listingRef = collection(db, 'listings')
        //Create a query (NOTE: params.categoryName is what we put in the URl on App.js Route)
        const queryDB = query(
          listingRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10)
        )

        // Execute Query to get snapshot
        const querySnapshot = await getDocs(queryDB)
        const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length -1]
        setLastFetchedListing(lastVisibleDoc) //get the last listing for pagination
        const listings = []
        querySnapshot.forEach(doc => {
          // console.log(doc.data())
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })
        setListings(listings)
        setLoading(false)
      } catch (error) {
        toast.error('Could not fetch listings')
      }
    }
    fetchListing()
  }, [])

  const onMoreFetchedListings = async () => {
    try {
      // Get reference
      const listingRef = collection(db, 'listings')
      const queryDB = query(
        listingRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10)
      )

      // Execute Query to get snapshot
      const querySnapshot = await getDocs(queryDB)
      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length -1]
      setLastFetchedListing(lastVisibleDoc) //get the last listing for pagination
      const listings = []
      querySnapshot.forEach(doc => {
        // console.log(doc.data())
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setListings((prevState) => [...prevState, ...listings])
      setLoading(false)
    } catch (error) {
      toast.error('Could not fetch listings')
    }
  }
  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>Offers</p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='categoryListings'>
              {listings.map(listing => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
          <br />
        <br />
        {lastFetchedListing && (
          <p className="loadMore" onClick={onMoreFetchedListings}>Load More</p>
        )}
        </>
      ) : (
        <p>There are no current offers at the moment, please check back later</p>
      )}
    </div>
  )
}

export default Offers
