/* eslint-disable react/no-array-index-key */
/* eslint-disable no-console */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

function ProductDescription({ product }) {
  const [features, changeFeatures] = useState([]);

  const getAllProductInfo = (id) => {
    axios.get(`/api/shared/products/${id}`)
      .then((res) => {
        changeFeatures(res.data.features);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (product.hasOwnProperty('id')) {
      getAllProductInfo(product.id);
    }
  }, [product]);

  const renderFeatures = () => {
    // sometimes there are duplicate features on one product (???)
    const uniqueFeatures = [];
    for (const feature of features) {
      if (!uniqueFeatures.includes(feature)) {
        uniqueFeatures.push(feature);
      }
    }
    return uniqueFeatures.map((feature, i) => {
      let valueWithoutQuotes = '';
      if (feature.value) {
        valueWithoutQuotes = feature.value.replace(/^"|"$/g, ''); // remove quotation marks from values (not all features have a value prop)
      }
      return (
        <li widgetname="overview" key={i} style={{ display: 'flex', flexFlow: 'row nowrap' }}>
          <span widgetname="overview" style={{ marginRight: 5 }}>✔ </span>
          <span widgetname="overview" style={{ marginRight: 5 }}>{`${feature.feature}`}</span>
          <span widgetname="overview" style={{ color: 'gray' }}>{valueWithoutQuotes}</span>
        </li>
      );
    });
  };

  const addPeriodIfMissing = (str = null) => {
    if (str) {
      const lastChar = str.slice(-1);
      if (lastChar !== '.') {
        return '.';
      }
    }
    return null;
  };

  return (
    <div widgetname="overview">
      {product !== null
        ? (
          <div widgetname="overview" className="product-info-bottom">
            <div widgetname="overview" className="slogan-description-container">
              <div widgetname="overview" className="product-slogan">
                {product.slogan}
                {addPeriodIfMissing(product.slogan)}
              </div>
              <div widgetname="overview" className="product-description">
                {product.description}
                {addPeriodIfMissing(product.description)}
              </div>
            </div>
            {features.length
              ? (
                <ul widgetname="overview" className="feature-list">
                  {renderFeatures()}
                </ul>
              )
              : null}
          </div>
        )
        : null}
    </div>
  );
}

ProductDescription.propTypes = {
  product: PropTypes.object,
};

ProductDescription.defaultProps = {
  product: {},
};

export default ProductDescription;
