/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/extensions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ZoomedImage from './ZoomedImage.jsx';

function ExpandedView({
  close,
  handleIconClick,
  url,
  photos,
  back,
  forward,
  selectedPhotoIndex,
}) {
  const [isZoomed, toggleZoom] = useState(false);

  const renderExpandedViewIcons = () => (
    <div widgetname="overview" className="expanded-view-icons-row">
      {photos.map((photo, i) => (
        <div
          widgetname="overview"
          className="expanded-view-icon"
          key={i}
          onClick={(e) => handleIconClick(e, photo.url, i)}
          id={i === selectedPhotoIndex ? 'selected' : null}
        />
      ))}
    </div>
  );

  const zoom = () => {
    toggleZoom(!isZoomed);
  };

  return (
    <div widgetname="overview" className="expanded-gallery-modal-inner">
      <button
        widgetname="overview"
        type="button"
        onClick={() => close()}
        id="modal-x-button"
      >
        <i widgetname="overview" className="fas fa-times" />
      </button>
      {isZoomed
        ? <ZoomedImage url={url} zoom={zoom} />
        : <img widgetname="overview" className="expanded-view-image" alt="" onClick={() => zoom()} src={url} />}
      <div
        widgetname="overview"
        className={isZoomed ? 'expanded-arrow-and-icon-container-fadeout' : 'expanded-arrow-and-icon-container-fadein'}
      >
        {isZoomed ? null : (
          <div widgetname="overview" className="expanded-arrow-and-icon-container">
            <button
              widgetname="overview"
              type="button"
              id={selectedPhotoIndex > 0 ? null : 'hidden'}
              className="horizontal-arrow"
              onClick={(e) => { back(e); }}
            >
              <i widgetname="overview" className="fas fa-chevron-left" />
            </button>
            {renderExpandedViewIcons()}
            <button
              widgetname="overview"
              type="button"
              id={selectedPhotoIndex < photos.length - 1 ? null : 'hidden'}
              className="horizontal-arrow"
              onClick={(e) => { forward(e); }}
            >
              <i widgetname="overview" className="fas fa-chevron-right" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

ExpandedView.propTypes = {
  close: PropTypes.func,
  handleIconClick: PropTypes.func,
  url: PropTypes.string,
  photos: PropTypes.array,
  back: PropTypes.func,
  forward: PropTypes.func,
  selectedPhotoIndex: PropTypes.number,
};

ExpandedView.defaultProps = {
  close: null,
  handleIconClick: null,
  url: null,
  photos: null,
  back: null,
  forward: null,
  selectedPhotoIndex: null,
};

export default ExpandedView;
