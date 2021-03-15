import React, { useEffect, useState } from 'react';
import CharacteristicsElement from './CharacteristicsElement.jsx';

const CharacteristicsList = ({ characteristics }) => (
  <div widgetname="reviews">
    { characteristics.map((char) => (
      <CharacteristicsElement characteristic={char} key={char[1].id} />
    )) }
  </div>
);

export default CharacteristicsList;
