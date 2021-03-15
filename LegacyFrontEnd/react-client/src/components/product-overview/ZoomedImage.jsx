/* eslint-disable no-mixed-operators */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function ZoomedImage({
  url,
  zoom,
}) {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [backgroundPosition, changePosition] = useState('50% 50%');

  useEffect(() => {
    setBackgroundImage(`url(${url})`);
  }, [url]);

  const handleMouseMove = (e) => {
    const { width, height } = e.target.getBoundingClientRect();
    const x = e.pageX / width * 100;
    const y = e.pageY / height * 100;
    changePosition(`${x}% ${y}%`);
  };

  return (
    <figure
      widgetname="overview"
      onMouseMove={(e) => handleMouseMove(e)}
      style={{ backgroundImage, backgroundPosition }}
      onClick={() => zoom()}
    />
  );
}

ZoomedImage.propTypes = {
  url: PropTypes.string,
  zoom: PropTypes.func,
};

ZoomedImage.defaultProps = {
  url: null,
  zoom: null,
};

export default ZoomedImage;
