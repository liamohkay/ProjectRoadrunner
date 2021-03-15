/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-prototype-builtins */
/* eslint-disable import/extensions */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SocialIcon } from 'react-social-icons';
import Stars from '../Reviews/Ratings/Stars.jsx';
import axios from 'axios'

function ProductInformation({
  product,
  price,
  sale,
  avgRating,
}) {

  const [reviewCount, changeReviewCount] = useState(0);

  const getReviewCount = () => {
    axios.get(`/api/reviews/?product_id=${product.id}&count=100`)
      .then((data) => {
        changeReviewCount(data.data.results.length);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (product.hasOwnProperty('id')) {
      getReviewCount();
    }
  }, [product])

  const renderPrice = () => {
    if (sale) {
      return (
        <span widgetname="overview">
          <span widgetname="overview" className="price" style={{ color: 'rgb(255, 0, 140)' }}>
            $
            {sale}
            {' '}
          </span>
          <span widgetname="overview" className="price" style={{ textDecoration: 'line-through' }}>
            {price}
          </span>
        </span>
      );
    }
    return (
      <span className="price">
        $
        {price}
      </span>
    );
  };

  const renderSocialMediaIcons = () => {
    const socialIconStyle = { marginRight: '0.25rem', height: '2rem', width: '2rem' };
    const socials = ["http://facebook.com", "http://twitter.com", "http://pinterest.com"]
    return <div widgetname="overview" className="social-media-links">
      {socials.map((site, i) => {
        return <SocialIcon
          key={i}
          target="_blank"
          widgetname="overview"
          style={socialIconStyle}
          url={site} />
      })}
    </div>
  };

  const scrollToReviews = () => {
    document.querySelector('.reviews-list').scrollIntoView({
      behavior: 'smooth',
    });
  };

  const uppercase = (str = '') => (str.toUpperCase());

  return (
    <div widgetname="overview">
      {product.hasOwnProperty('id')
        ? (
          <div widgetname="overview" className="product-info-side">
            {reviewCount > 0 ?
              <div widgetname="overview" className="product-rating">
                <Stars avgRating={avgRating} />
                <span widgetname="overview" id="reviews-link" onClick={() => scrollToReviews()}>Read all {reviewCount} reviews</span>
              </div>
              : null
            }
            <div widgetname="overview" className="product-category">
              {uppercase(product.category)}
            </div>
            <div widgetname="overview" className="product-name">
              {product.name}
            </div>
            <div widgetname="overview" className="product-price">{renderPrice()}</div>
            {renderSocialMediaIcons()}
          </div>
        )
        : null}
    </div>
  );
}

ProductInformation.propTypes = {
  product: PropTypes.object,
  price: PropTypes.any,
  sale: PropTypes.any,
  avgRating: PropTypes.number,
};

ProductInformation.defaultProps = {
  product: {},
  price: null,
  sale: null,
  avgRating: null,
};

export default ProductInformation;
