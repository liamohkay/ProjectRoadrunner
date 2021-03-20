import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RelatedItems = () => {
  const [styles, updateStyles] = useState([]);

  useEffect(() => {
    getProductStyles()
  }, [])

  const getProductStyles = () => {
    axios.get(`/api/products/16060/styles`)
    .then((results) => (updateStyles(results.data)))
    .catch((err) => (console.log(err)))
  }

  return (
    <div>
      <h3>Related Products</h3>
      <button onClick={() => (console.log('clicked'))}>Compare</button>
      <p>{styles ? styles.category : 'waiting'}</p>
      <p>{styles ? styles.name : 'waiting'}</p>
      <p>{styles ? styles.original_price : 'waiting'}</p>
    </div>
  )
}

export default RelatedItems