import React, { useState, useEffect } from 'react';

const RatingsBreakdownElement = ({ score, percentage, manipulateFilters }) => (
    <div widgetname="reviews" style={{display: 'flex', flexDirection: 'row'}} >
      <div widgetname="reviews" onClick={() => manipulateFilters(score)} >
        <div widgetname="reviews" id="score" className="text" >
        {`${score}
        stars`}
        </div>
    </div>
    <div widgetname="reviews" className="progress">
      <div widgetname="reviews" className="progress-done"
        style={{
          opacity: 1,
          width: `${percentage}%`
        }}>
      </div>
    </div>
  </div>
);

export default RatingsBreakdownElement