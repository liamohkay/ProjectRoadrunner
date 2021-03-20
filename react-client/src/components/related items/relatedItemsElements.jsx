import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RelatedItemCard from './RelatedItemCard.jsx';

function RelatedItemsElements(props) {
  const [dataArr, updateDataArr] = useState([]);
  const [stylesData, updateStylesData] = useState([]);
  const [relatedRatings, updateRelatedRatings] = useState([]);

  useEffect(() => {
    getRelatedData();
    getRelatedPhotos();
    getRelatedRatings();
  }, [props.currentProductFeatures])

  let getRelatedData = () => {
    let uniqueItems = [];
    props.relatedItemsIds.map(item => {
      axios.get(`/api/shared/products/${item}`)
        .then((results) => (uniqueItems.push(results.data)))
        .then(() => (updateDataArr(uniqueItems)))
        .catch((err) => (console.log(err)))
    });
  };

  let getRelatedPhotos = () => {
    props.relatedItemsIds.map(item => {
      axios.get(`/api/shared/products/${item}/styles`)
        .then((results) => (updateStylesData(stylesData => ([...stylesData, results.data]))))
        .catch((err) => (console.log(err)))
    });
  };

  let getRelatedRatings = () => {
    let allMetaData = [];
    props.relatedItemsIds.map(item => {
      axios.get(`/api/reviews/meta?product_id=${item}`)
      .then((results) => (allMetaData.push({id: results.data.product_id, ratings: results.data.ratings})))
      .then(() => updateRelatedRatings(allMetaData.map(item => ({id: item.id, rating: findAvgRating(item.ratings)}))))
      .catch((err) => (console.log(err)))
    });
  };

  const findAvgRating = (ratings) => {
    if (Object.keys(ratings).length === 0) {
      return '';
    }
    let totalScore = 0;
    let amountOfRatings = 0;
    for (const key in ratings) {
      const value = Number(ratings[key]);
      const actualValue = key * value;
      totalScore += actualValue;
      amountOfRatings += value;
    }
    const averageScore = totalScore / amountOfRatings;
    const rounded = Math.round(averageScore * 4) / 4;
    return rounded;
  };

  return (
    <div>
      <RelatedItemCard
        dataArr={dataArr}
        stylesData={stylesData}
        relatedRatings={relatedRatings}
        currentProduct={props.currentProduct}
        currentProductFeatures={props.currentProductFeatures}
        relatedItemsIds={props.relatedItemsIds}
        selectProduct={props.selectProduct} />
    </div>
  )
}

export default RelatedItemsElements;