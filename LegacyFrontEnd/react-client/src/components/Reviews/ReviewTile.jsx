import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Highlighter from 'react-highlight-words';
import header from '../../../../config.js';
import ReviewPhotos from './ReviewPhotos.jsx';
import Stars from './Ratings/Stars.jsx';

const ReviewTile = ({
  searchQuery, metadata, review, avgRating, getReviews,
}) => {
  const date = new Date(review.date).toUTCString().slice(4, -12);
  const [hasMarked, setHasMarked] = useState(false);
  const [longerThan250, setLongerThan250] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);

  useEffect(() => {
    setLongerThan250(false);
    if (review.body.length > 250) {
      setLongerThan250(true);
    }
  }, [review]);
  
  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsHighlighting(true);
    } else {
      setIsHighlighting(false);
    }
  }, [searchQuery]);

  let reviewText;
  if (!longerThan250) {
    reviewText = (
      <div>
        {review.body}
      </div>
    );
  } else {
    reviewText = (
      <div widgetname="reviews">
        {review.body.slice(0, 250)}
        <div widgetname="reviews" style={{ fontSize: '14px', fontWeight: 'bold' }} className="text" onClick={() => setLongerThan250(false)}>
          show more..
        </div>
      </div>
    );
  }

  const day = date.slice(0, 3);
  const month = date.slice(-9, -6);
  const year = date.slice(-5);
  const dateAndUser = `${review.reviewer_name}, ${month} ${day}, ${year}`;
  let form;
  if (!review.recommend) {
    form = '';
  } else {
    form = <div widgetname="reviews" className="reviewGuts" style={{ fontWeight: 'bold' }}>✔ I recommend this product</div>;
  }
  let response;
  if (review.response) {
    response = (
      <div id="response-container">
        <div widgetname="reviews" id="response">
          Response from seller:
        </div>
        <div widgetname="reviews" id="response-text">
          {review.response}
        </div>
      </div>
    );
  } else {
    response = '';
  }

  const markAsHelpful = () => {
    if (!hasMarked) {
      axios.put(`/api/reviews/${review.review_id}/helpful`, null)
        .then(() => {
          getReviews();
        })
        .catch((err) => console.log(err));
      setHasMarked(true);
    }
  };

  const reportReview = () => {
    axios.put(`/api/reviews/${review.review_id}/report`, null)
      .then(() => {
        getReviews();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div widgetname="reviews" className="reviewTile">
      <div widgetname="reviews" id="stars-user" style={{ display: 'flex', flexDirection: 'row' }}>
        <div widgetname="reviews" className="stars">
          {' '}
          <Stars avgRating={review.rating} />
        </div>
        <div widgetname="reviews" className="userName">
          {dateAndUser}
        </div>
      </div>
      <div widgetname="reviews" className="reviewSummary">
        {' '}
        {review.summary}
        {' '}
      </div>
      <div widgetname="reviews" className="reviewGuts">
        {isHighlighting
          ? (
            <Highlighter
              highlightClassName="found"
              searchWords={[searchQuery]}
              autoEscape
              textToHighlight={review.body}
            />
          )
          : longerThan250
            ? (
              <div widgetname="reviews">
                {review.body.slice(0, 250)}
                <div widgetname="reviews" style={{ fontSize: '14px', fontWeight: 'bold' }} className="text" onClick={() => setLongerThan250(false)}>
                  show more..
                </div>
              </div>
            )
            : (
              <div>
                {review.body}
              </div>
            )}
      </div>
      <ReviewPhotos photos={review.photos} />
      {form}
      <div widgetname="reviews" className="reviewGuts">
        {response}
        {' '}
      </div>
      <div widgetname="reviews" className="reviewGuts" style={{ display: 'flex', flexDirection: 'row' }}>
        Helpful?
        <div widgetname="reviews" id="yes" className="text" onClick={markAsHelpful}>Yes</div>
        {`(${review.helpfulness})`}
        <div widgetname="reviews" id="yes" className="text" onClick={markAsHelpful}>No</div>
        {`(${review.helpfulness})`}
        <div widgetname="reviews" id="yes">|</div>
        <div widgetname="reviews" id="yes" className="text" onClick={reportReview}>report</div>
      </div>
    </div>
  );
};

export default ReviewTile;
