import React from 'react';

const CharacteristicsElement = ({ characteristic }) => {
  let score = characteristic[1].value || 0.2;
  let percent =  score * 20;
  let first;
  let second;
  let third;
  if (characteristic[0] === "Quality" || characteristic[0] === "Comfort") {
    first = 'Poor';
    second = '';
    third = "Perfect"
  } else if (characteristic[0] === 'Size' || characteristic[0] === 'Width' || characteristic[0] === 'Fit' || characteristic[0] === 'Length') {
    first = 'Too small';
    second = 'Perfect';
    third = "Too Large"
  }

  return (
    <div widgetname="reviews">
      <div widgetname="reviews" id="characteristic">
        {characteristic[0]}
      </div>
      <div widgetname="reviews" className="container">
        <div widgetname="reviews" className="characteristicsTriple"></div>
        <div widgetname="reviews" className="characteristicsTriple"></div>
        <div widgetname="reviews" className="characteristicsTriple"></div>
        <div widgetname="reviews" style={{left: `${percent}%`}} className="selector"></div>
      </div>
      <div widgetname="reviews" className="container" style={{display: 'flex', flexDirection: 'row'}}>
        <div widgetname="reviews" className="triple-text"><div className="text-under-bar" >{first}</div></div>
        <div widgetname="reviews" className="triple-text"><div className="text-under-bar" >{second}</div></div>
        <div widgetname="reviews" className="triple-text"><div className="text-under-bar" >{third}</div></div>
      </div>
    </div>
  );
};

export default CharacteristicsElement;
