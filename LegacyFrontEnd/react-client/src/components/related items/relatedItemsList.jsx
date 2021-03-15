import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RelatedItemsElements from './RelatedItemsElements.jsx';
import YourOutfitList from './YourOutfitList.jsx';

function RelatedItemsList(props) {
  const [currentProductFeatures, updateCurrentProductFeatures] = useState([]);
  const [relatedItemsIds, updateRelatedItems] = useState([]);
  let currentProductId = props.currentProduct.id || 16060;

  useEffect(() => {
    getCurrentFeatures();
    getRelatedIds();
  },  [props.currentProduct])

  let getCurrentFeatures = () => {
    axios.get(`/api/shared/products/${currentProductId}`)
      .then((results) => (updateCurrentProductFeatures(results.data)))
      .catch((err) => (console.log))
  };

  let getRelatedIds = () => {
    axios.get(`/api/shared/products/${currentProductId}/related`)
      .then((results) => (updateRelatedItems(results.data.filter(item => (item !== 16057)))))
      .catch((err) => console.log(err))
  };

  return (
    <div>
      <h3 id="related-title">RELATED PRODUCTS</h3>
      <RelatedItemsElements
        currentProductFeatures={currentProductFeatures}
        selectProduct={props.selectProduct}
        currentProduct={props.currentProduct}
        relatedItemsIds={relatedItemsIds} />
    </div>
  )
}

export default RelatedItemsList;