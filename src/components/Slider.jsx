import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/a11y'
import Spinner from './Spinner'

function Slider () {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchListings = async () => {
      //collection ref
      const listingRef = collection(db, 'listings')
      const queryDB = query(listingRef, orderBy('timestamp', 'desc'), limit(5))
      const querySnapshot = await getDocs(queryDB)
      let listings = []
      //loop through snapshot
      querySnapshot.forEach(doc => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setListings(listings)
      setLoading(false)
    }
    fetchListings()
    console.log(listings)
  }, [])

  if(loading){
    return <Spinner />
  }

  // if no listings 
  if(listings.length === 0 ){
    console.log('no listings available for use in slider - add some listings!')
    return <></>
  }

  return listings && (
    <>
     <p className="exploreHeading">
        Recommended
     </p>
     <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        style={{ height: '300px' }}
      >
        {listings.map(({data, id}) => {
            return (
                <SwiperSlide key={id}
                onClick={() => navigate(`/category/${data.type}/${id}`)}>
                    <div className="swiperSlideDiv" 
                    style={{
                        background: `url(${data.imgUrls[0]}) center no-repeat`,
                        backgroundSize: 'cover'
                    }}>
                        <p className="swiperSlideText">{data.name}</p>
                        <p className="swiperSlidePrice">???{data.discountedPrice ?? data.regularPrice}{data.type === 'rent' && ' / month'}</p>

                    </div>
                </SwiperSlide>
            )
        })}


      </Swiper>
    </>
  )
}

export default Slider
