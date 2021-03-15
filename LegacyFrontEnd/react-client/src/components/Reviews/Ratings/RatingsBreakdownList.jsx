import React from 'react';
import RatingsBreakdownElement from './RatingsBreakdownElement.jsx';

const RatingsBreakdownList = ({ percentagePerRating, manipulateFilters }) => (
    <div widgetname="reviews">
      { percentagePerRating.map((percentage, i) => {
        if (i > 0) {
          return (
            <RatingsBreakdownElement
            manipulateFilters={manipulateFilters}
              key={i} score={i} percentage={percentage} />
          )
        }
      }) }
    </div>
);

export default RatingsBreakdownList;
