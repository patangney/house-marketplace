import { Link } from 'react-router-dom'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'
import PropTypes from 'prop-types'

function ListingItem ({listing, id}) {
  return (
    <li className='categoryListing'>
      <Link
        to={`/category/${listing.type}/${id}`}
        className='categoryListingLink'
      >
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className='categoryListingImg'
        />
      </Link>
    </li>
  )
}

export default ListingItem

// ListingItem.propTypes = {
//     listing: PropTypes.object.isRequired,
//     id: PropTypes.string

// }


