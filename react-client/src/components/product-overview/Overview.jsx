/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/extensions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ProductInformation from './ProductInformation.jsx';
import ProductDescription from './ProductDescription.jsx';
import ImageGallery from './ImageGallery.jsx';
import StyleSelector from './StyleSelector.jsx';
import Banner from './Banner.jsx';

function Overview({
  product,
  avgRating,
  darkMode
}) {
  const [selectedStyle, selectStyle] = useState(0);
  const [price, updatePrice] = useState(0);
  const [sale, updateSale] = useState(0);
  const [photos, updatePhotos] = useState([]);
  const [selectedPhoto, selectPhoto] = useState('');

  return (
    <div widgetname="overview">
      <Banner/>
      {product
        ? (
          <div className="overview" widgetname="overview">
            <ImageGallery selectedPhoto={selectedPhoto} selectPhoto={selectPhoto} photos={photos} />
            <div className="right-side" widgetname="overview">
              <ProductInformation
                product={product}
                selectedStyle={selectedStyle}
                price={price}
                sale={sale}
                avgRating={avgRating}
              />
              <StyleSelector
                product={product}
                selectedStyle={selectedStyle}
                selectStyle={selectStyle}
                updatePrice={updatePrice}
                updateSale={updateSale}
                selectPhoto={selectPhoto}
                updatePhotos={updatePhotos}
                darkMode={darkMode}
              />
            </div>
          </div>
        )
        : null}
      <ProductDescription product={product} />
    </div>
  );
}

Overview.propTypes = {
  product: PropTypes.object,
  avgRating: PropTypes.number,
  darkMode: PropTypes.bool,
};

Overview.defaultProps = {
  product: {},
  avgRating: null,
  darkMode: false,
};

export default Overview;
