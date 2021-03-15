/* eslint-disable import/extensions */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import ExpandedView from './ExpandedView.jsx';

const modalStyle = {
  content: {
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflowY: 'hidden',
  },
};

function ImageGallery({
  selectPhoto,
  photos,
}) {
  const [selectedPhotoIndex, changePhotoIndex] = useState(0);

  const [expandedGalleryView, toggleGalleryView] = useState(false);

  const between = (target, min, max) => target >= min && target <= max;

  const handleThumbnailClick = (event, url, idx) => {
    event.stopPropagation();
    selectPhoto(url);
    changePhotoIndex(idx);
  };

  const scrollForward = (event) => {
    event.stopPropagation();
    if (selectedPhotoIndex === photos.length - 1) {
      // changePhotoIndex(0) for infinite scroll
    } else {
      const nextIndex = selectedPhotoIndex + 1;
      changePhotoIndex(nextIndex);
    }
  };

  const scrollBack = (event) => {
    event.stopPropagation();
    if (selectedPhotoIndex === 0) {
      // changePhotoIndex(photos.length - 1) for infinite scroll
    } else {
      const nextIndex = selectedPhotoIndex - 1;
      changePhotoIndex(nextIndex);
    }
  };

  const shouldShowThumbnail = (idx) => {
    if (selectedPhotoIndex + 6 < photos.length) {
      return between(idx, selectedPhotoIndex, selectedPhotoIndex + 6);
    }
    const diff = Math.abs((selectedPhotoIndex + 7) - photos.length);
    if (between(idx, selectedPhotoIndex - diff, photos.length)) {
      return true;
    }
    return between(idx, selectedPhotoIndex, photos.length);
  };

  const renderThumbnails = () => {
    if (photos.length < 7) {
      return (
        <div widgetname="overview" className="gallery-thumbnails-container">
          {photos.map((photo, i) => (
            <img
              widgetname="overview"
              alt="thumbnail"
              className="image-thumbnail"
              key={i}
              src={photo.thumbnail_url}
              onClick={(event) => {
                handleThumbnailClick(event, photo.url, i);
              }}
              id={i === selectedPhotoIndex ? 'selected' : null}
            />
          ))}
        </div>
      );
    }
    return (
      <div widgetname="overview" className="gallery-thumbnails-container">
        <button
          widgetname="overview"
          type="button"
          id={selectedPhotoIndex === 0 ? 'hidden' : null}
          className="vertical-arrow"
          role="button"
          onClick={(event) => { scrollBack(event); }}
        >
          <i widgetname="overview" className="fas fa-chevron-up" />
        </button>
        {photos.map((photo, i) => (
          <div
            widgetname="overview"
            alt="thumbnail"
            className={shouldShowThumbnail(i) ? 'image-thumbnail' : 'image-thumbnail-hidden'}
            id={i === selectedPhotoIndex ? 'selected' : null}
            style={{
              backgroundImage: `url(${photo.thumbnail_url})`,
              backgroundPosition: '50% 50%',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
            key={i}
            onClick={(event) => {
              handleThumbnailClick(event, photo.url, i);
            }}
          />
        ))}
        <button
          widgetname="overview"
          type="button"
          id={selectedPhotoIndex === photos.length - 1 ? 'hidden' : null}
          className="vertical-arrow"
          role="button"
          onClick={(event) => { scrollForward(event); }}
        >
          <i widgetname="overview" className="fas fa-chevron-down" />
        </button>
      </div>
    );
  };

  const mainImageCSS = (url) => ({
    backgroundImage: `url(${url})`,
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'scroll',
    backgroundPosition: 'center',
  });

  return (
    <div widgetname="overview" className="image-gallery-outer">
      {photos.length
        ? (
          <div
            widgetname="overview"
            className="image-gallery-main-image"
            style={mainImageCSS(photos[selectedPhotoIndex].url)}
            onClick={() => (expandedGalleryView ? null : toggleGalleryView(true))}
          >
            {renderThumbnails()}

            <Modal widgetname="overview" id="expanded-gallery-modal" isOpen={expandedGalleryView} style={modalStyle} ariaHideApp={false}>
              <ExpandedView
                close={() => toggleGalleryView(false)}
                photos={photos}
                selectedPhotoIndex={selectedPhotoIndex}
                url={photos[selectedPhotoIndex].url}
                handleIconClick={handleThumbnailClick}
                back={scrollBack}
                forward={scrollForward}
              />
            </Modal>

            <div widgetname="overview" className="horizontal-arrow-container">
              <button widgetname="overview" role="button"
               className="horizontal-arrow" id={selectedPhotoIndex > 0 ? null : 'hidden'} onClick={(event) => { scrollBack(event); }}>
                <i widgetname="overview" className="fas fa-chevron-left" />
              </button>
              <button widgetname="overview" role="button" className="horizontal-arrow" id={selectedPhotoIndex < photos.length - 1 ? null : 'hidden'} onClick={(event) => { scrollForward(event); }}>
                <i widgetname="overview" className="fas fa-chevron-right" />
              </button>
            </div>
          </div>
        )
        : null}
    </div>
  );
}

ImageGallery.propTypes = {
  selectPhoto: PropTypes.func,
  photos: PropTypes.array,
};

ImageGallery.defaultProps = {
  selectPhoto: null,
  photos: null,
};

export default ImageGallery;
