// Write your code here
// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import {Loader} from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    itemsList: [],
    isLoading: true,
    count: 1,
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductItemData()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
    similarProducts: data.similar_products,
  })

  getProductItemData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiURL = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiURL, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )
      this.setState({
        itemsList: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
      if (response.status === 404) {
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }
    }
  }

  onDecrement = () => {
    const {count} = this.state
    if (count !== 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  renderSuccessView = () => {
    const {itemsList, count, similarProductsData} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = itemsList
    console.log(similarProductsData)

    return (
      <div>
        <div className="success-con">
          <img src={imageUrl} className="product-image" alt="product" />
          <div className="right-con">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="flex-con">
              <button className="rating">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-img"
                />
                <p>{rating}</p>
              </button>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="available-text">Available: {availability}</p>
            <p className="available-text">Brand: {brand}</p>
            <hr />
            <div className="set-quantity-con">
              <button
                className="dummy-button"
                onClick={this.onDecrement}
                data-testid="minus"
              >
                <BsDashSquare className="icon" />.
              </button>
              <p className="description">{count}</p>
              <button
                className="dummy-button"
                onClick={this.onIncrement}
                data-testid="plus"
              >
                <BsPlusSquare className="icon" />.
              </button>
            </div>
            <button className="add-to-cart-button">ADD TO CART</button>
          </div>
        </div>
        <div>
          <h1 className="similar-products-head">Similar Products</h1>
          <ul className="similar-products-con">
            {similarProductsData.map(each => (
              <SimilarProductItem key={each.id} similarProductsDetails={each} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="add-to-cart-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoaderView = () => (
    // eslint-disable-next-line react/no-unknown-property
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderProductDetails()}
      </div>
    )
  }
}

export default ProductItemDetails
