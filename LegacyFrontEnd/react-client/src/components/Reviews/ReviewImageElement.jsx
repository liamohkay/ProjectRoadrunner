import React, { useState } from 'react';
import Modal from 'react-modal';

const ReviewImageElement = ({ url }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  }
  return (
    <div widgetname="reviews" onClick={toggleModal}>
      <Modal isOpen={modalIsOpen} >
        <span widgetname="reviews" className="close" onClick={toggleModal} >Close</span>
      <img widgetname="reviews" src={url}/>
      </Modal>
      <img widgetname="reviews" className="reviewThumb" src={url}/>
    </div>
  );
};

export default ReviewImageElement;
