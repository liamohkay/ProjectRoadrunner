/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import header from '../../../../config.js';

const MockPostReviewForm = (props) => {
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [postModalIsOpen, setPostModalIsOpen] = useState(true);
  const [rating, setRating] = useState(0);
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [recommend, setRecommend] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photos, setPhotos] = useState([]);
  const [summaryLengthisValid, setSummaryLengthIsValid] = useState(false);
  const [bodyIsValidLength, setBodyIsValidLength] = useState(false);
  const [reviewIsValid, setReviewIsValid] = useState(false);
  const [arrOfCharacteristicChoices, setArrOfCharacteristicChoices] = useState([]);
  const [charObj, setCharObj] = useState({});

  useEffect(() => {
    createCharacteristicChoices();
    checkSummaryLength();
    CheckBodyLength();
  }, [summary, body, props.characteristicsArr]);

  const images = [];
  const setImages = (e) => {
    const idx = Number(e.target.name);
    images[idx] = e.target.value;
  };

  const toggleModal = (e) => {
    e.preventDefault();
    setImageModalIsOpen(!imageModalIsOpen);
  };
  const updateImages = (e) => {
    toggleModal(e);
    setPhotos(images);
  };

  let belowBody;
  if (body.length < 50) {
    const amountLeft = 50 - body.length;
    belowBody = (
      <div widgetname="reviews" style={{ margin: '1%' }}>
        Minimum required characters left:
        {amountLeft}
      </div>
    );
  } else {
    belowBody = <div widgetname="reviews">Minimum reached</div>;
  }

  const reviewPost = {
    product_id: props.review_id,
    rating,
    summary,
    body,
    recommend,
    name,
    email,
    photos,
    characteristics: charObj,
  };

  const checkSummaryLength = () => {
    if (summary.length > 1 && summary.length < 61) {
      setSummaryLengthIsValid(true);
      return true;
    }
    return false;
  };
  const CheckBodyLength = () => {
    if (body.length > 50 && body.length < 1000) {
      return true;
      setBodyIsValidLength(true);
    }
    return false;
  };

  const setCharacteristic = (key, value) => {
    charObj[key] = Number(value);
    setCharObj(charObj);
  };

  const setBool = (bool) => {
    if (bool === 'true') {
      setRecommend(true);
    } else {
      setRecommend(false);
    }
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (reviewPost.rating < 1) {
      alert('You must enter the following: Rating');
    } else if (!checkSummaryLength()) {
      alert('You must enter the following: Summary');
    } else if (typeof reviewPost.recommend !== 'boolean') {
      alert('You must enter the following: recommend');
    } else if (!CheckBodyLength()) {
      alert('You must enter the following: Body');
    } else if (reviewPost.name === '') {
      alert('You must enter the following: Name');
    } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(reviewPost.email)) {
      alert('You must enter the following: Email');
    } else {
      setPostModalIsOpen(!postModalIsOpen);
      axios.post('/api/reviews/', reviewPost)
        .then((data) => {
          alert('submitted a new review');
          props.getReviews();
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const createCharacteristicChoices = () => {
    const possibilities = [];
    const size = ['id', 'Size', '1 - A size too small', '2 - ½ a size too small', '3 - Perfect', '4 - ½ a size too big', '5 - A size too wide'];
    const width = ['id', 'Width', '1 - Too narrow', '2 - Slightly narrow', '3 - Perfect', '4 - Slightly wide', '5 - Too wide'];
    const comfort = ['id', 'Comfort', '1 - Uncomfortable', '2 - Slightly uncomfortable', '3 - Ok', '4 - Comfortable', '5 - Perfect'];
    const quality = ['id', 'Quality', '1 - Poor', '2 - Below average', '3 - What I expected', '4 - Pretty great', '5 - Perfect'];
    const length = ['id', 'Length', '1 - Runs Short', '2 - Runs slightly short', '3 - Perfect', '4 - Runs slightly long', '5 - Runs long'];
    const fit = ['id', 'Fit', '1 - Runs tight', '2 - Runs slightly tight', '3 - Perfect', '4 - Runs slightly long', '5 - Runs long'];
    props.characteristicsArr.forEach((e) => {
      if (e[0] === 'Size') {
        size[0] = e[1].id;
        possibilities.push(size);
      }
      if (e[0] === 'Width') {
        width[0] = e[1].id;
        possibilities.push(width);
      }
      if (e[0] === 'Comfort') {
        comfort[0] = e[1].id;
        possibilities.push(comfort);
      }
      if (e[0] === 'Quality') {
        quality[0] = e[1].id;
        possibilities.push(quality);
      }
      if (e[0] === 'Length') {
        length[0] = e[1].id;
        possibilities.push(length);
      }
      if (e[0] === 'Fit') {
        fit[0] = e[1].id;
        possibilities.push(fit);
      }
      setArrOfCharacteristicChoices(possibilities);
    });
  };

  const options = ['Select Rating', '1 star - “Poor”', '2 stars - “Fair”', '3 stars - “Average”', '4 stars - “Good”', '5 stars - “Great”'];

  return (
    <Modal isOpen={postModalIsOpen}>
      <Modal isOpen={imageModalIsOpen}>
        <div widgetname="reviews" className="review-form-component">
          <label widgetname="reviews">
            Image 1:
            <input widgetname="reviews" style={{ margin: '1%' }} onChange={setImages} name="0" type="text" />
          </label>
        </div>
        <div widgetname="reviews" className="review-form-component">
          <label widgetname="reviews">
            Image 2:
            <input widgetname="reviews" style={{ margin: '1%' }} onChange={setImages} name="1" type="text" />
          </label>
        </div>
        <div widgetname="reviews" className="review-form-component">
          <label widgetname="reviews">
            Image 3:
            <input widgetname="reviews" style={{ margin: '1%' }} onChange={setImages} name="2" type="text" />
          </label>
        </div>
        <div widgetname="reviews" className="review-form-component">
          <label widgetname="reviews">
            Image 4:
            <input widgetname="reviews" style={{ margin: '1%' }} onChange={setImages} name="3" type="text" />
          </label>
        </div>
        <div widgetname="reviews" className="review-form-component">
          <label widgetname="reviews">
            Image 5:
            <input widgetname="reviews" style={{ margin: '1%' }} onChange={setImages} name="4" type="text" />
          </label>
        </div>
        <button widgetname="reviews" className="review-buttons" onClick={updateImages}>Submit</button>
        <button widgetname="reviews" className="review-buttons" onClick={toggleModal}>Cancel</button>
      </Modal>
      <div widgetname="reviews" style={{ display: 'flex', flexDirection: 'row' }}>
        <form widgetname="reviews" className="addReviewForm">
          <div widgetname="reviews" className="review-form-component">
            <label widgetname="reviews">
              Overall rating
              <select data-testid="ratings" widgetname="reviews" style={{ margin: '1%' }} onChange={(e) => setRating(Number(e.target.value))}>
                {options.map((option, i) => (
                  <option widgetname="reviews" value={i} key={i}>{option}</option>
                ))}
              </select>
            </label>
          </div>
          <div widgetname="reviews" className="review-form-component">
            <label widgetname="reviews">
              Do you recommend this product?
              <select data-testid="recommend" widgetname="reviews" style={{ margin: '1%' }} onChange={(e) => setBool(e.target.value)}>
                <option widgetname="reviews">Select</option>
                <option widgetname="reviews" value="true">Yes</option>
                <option widgetname="reviews" value="false">No</option>
              </select>
            </label>
          </div>
          <div widgetname="reviews" className="review-form-component" style={{ display: 'flex', flexDirection: 'row' }}>
            <label widgetname="reviews">
              Characteristics:
              {arrOfCharacteristicChoices.map((choiceArray, idx) => (
                <select key={idx} name={choiceArray[0]} onChange={(e) => setCharacteristic(e.target.name, e.target.value)}>
                  {choiceArray.slice(1, 7).map((choiceE, i) => (
                    <option widgetname="reviews" key={i} value={i}>{choiceE}</option>
                  ))}
                </select>
              ))}
            </label>
          </div>
          <div widgetname="reviews" className="review-form-component">
            <label widgetname="reviews">
              Review summary:
              <input widgetname="reviews" style={{ margin: '1%', width: '50%' }} placeholder="Example: Best purchase ever!" onChange={(e) => setSummary(e.target.value)} type="text" name="" />
            </label>
          </div>
          <div widgetname="reviews" className="review-form-component">
            <label widgetname="reviews">
              Review body:
              <input widgetname="reviews" style={{ margin: '1%', width: '100%' }} placeholder="Why did you like the product or not?" onChange={(e) => setBody(e.target.value)} type="text" name="" />
              {belowBody}
            </label>
          </div>
          <div widgetname="reviews" className="review-form-component">
            <label widgetname="reviews">
              Upload your photos:
              <button onClick={toggleModal}>Upload photos</button>
            </label>
          </div>
          <div widgetname="reviews" className="review-form-component">
            <label widgetname="reviews">
              What is your nickname?:
              <input widgetname="reviews" style={{ margin: '1%' }} placeholder="Example: jackson11!" onChange={(e) => setName(e.target.value)} type="text" name="" />
              <div widgetname="reviews">
                For privacy reasons, do not use your full name or email address
              </div>
            </label>
          </div>
          <div widgetname="reviews" id="text-under-form" className="review-form-component">
            <label widgetname="reviews">
              Your email:
              <input widgetname="reviews" style={{ margin: '1%' }} placeholder="Example: jackson11@email.com" onChange={(e) => setEmail(e.target.value)} type="email" name="" />
              <div widgetname="reviews">
                For authentication reasons, you will not be emailed
              </div>
            </label>
          </div>
          <button widgetname="reviews"
            className="review-buttons"
            onClick={(e) => {
              e.preventDefault();
              submitReview(e);
            }}
          >
            Submit
          </button>
          <button
            className="review-buttons"
            onClick={() => {
              setPostModalIsOpen(!postModalIsOpen);
              props.togglePostForm();
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    </Modal>

  );
};

export default MockPostReviewForm;
