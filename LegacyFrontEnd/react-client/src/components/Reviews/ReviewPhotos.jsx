import React, { useState } from 'react';
import ReviewImageElement from './ReviewImageElement.jsx';

const ReviewPhotos = (props) => (
  <div widgetname="reviews" className="reviewGuts" style={{display: 'flex', flexDirection: 'row'}}>
      { props.photos.map((photo, i) => (
      <ReviewImageElement key={i} url={photo.url} />
    )) }
  </div>
);

export default ReviewPhotos;
