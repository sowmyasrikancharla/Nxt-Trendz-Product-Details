import {Component} from 'react'
import './index.css'

class SimilarProductItem extends Component {
  render() {
    const {similarProductsDetails} = this.props
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = similarProductsDetails
    return (
      <div>
        <img src={imageUrl} className="similar-image" alt="similar_products" />
        <h2 className="available-text">{title}</h2>
        <p className="description">by {brand}</p>
        <div className="f-con">
          <p className="price">Rs {price}/-</p>
          <button className="rating">
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star-img"
            />
            {rating}
          </button>
        </div>
      </div>
    )
  }
}

export default SimilarProductItem
