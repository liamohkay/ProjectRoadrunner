import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Stars from '../Reviews/Ratings/Stars.jsx';
import Carousel from 'react-elastic-carousel';
import styled from 'styled-components';

function YourOutfitList(props) {
  const [yourOutfit, updateYourOutfit] = useState([]);
  const [tempPhotoData, updateTempPhotoData] = useState([]);
  const [yourOutfitPhoto, updateYourOutfitPhoto] = useState([]);
  const [yourOutfitRatings, updateYourOutfitRatings] = useState([]);

  useEffect(() => {
    let currentProductId = props.currentProduct.id;
    axios.get(`/api/shared/products/${currentProductId}/styles`)
      .then((results) => (updateTempPhotoData(results.data)))
      .catch((err) => (console.log(err)))
  }, [props.currentProduct, props.avgRating])

  useEffect(() => {
    const storedOutfits = localStorage.getItem('outfits');
    const storedPhotos = localStorage.getItem('photos');
    const storedRatings = localStorage.getItem('ratings');
    storedOutfits ? updateYourOutfit(JSON.parse(storedOutfits)) : null
    storedPhotos ? updateYourOutfitPhoto(JSON.parse(storedPhotos)) : null
    storedRatings ? updateYourOutfitRatings(JSON.parse(storedRatings)) : null
  }, [])

  useEffect(() => {
    localStorage.setItem('outfits', JSON.stringify(yourOutfit));
    localStorage.setItem('photos', JSON.stringify(yourOutfitPhoto));
    localStorage.setItem('ratings', JSON.stringify(yourOutfitRatings));
  }, [yourOutfit, yourOutfitPhoto, yourOutfitRatings])

  let addToYourOutfit = () => {
    let exists = JSON.parse(localStorage.outfits).find(outfit => outfit.id === props.currentProduct.id);
    if (exists) {
      return null;
    } else {
      console.log(yourOutfitRatings, props.currentProduct.id, props.avgRating)
      updateYourOutfit((yourOutfit) => ([props.currentProduct, ...yourOutfit]))
      updateYourOutfitPhoto((yourOutfitPhoto) => ([...yourOutfitPhoto, [Number(tempPhotoData.product_id), tempPhotoData.results[0].photos[0].thumbnail_url]]))
      let newYourOutfitRatings = yourOutfitRatings.map((arr) => arr)
      newYourOutfitRatings.push([props.currentProduct.id, props.avgRating]);
      updateYourOutfitRatings((newYourOutfitRatings))
    }
  };

  let removeFromYourOutfit = (e) => {
    let id = Number(e.target.value);
    updateYourOutfit(yourOutfit.filter((outfit) => (outfit.id !== id)));
    updateYourOutfitPhoto(yourOutfitPhoto.filter((photo) => (photo[0] !== id)));
    updateYourOutfitRatings(yourOutfitRatings.filter((rating) => (rating[0] !==id)));
  };

  let getImgSrc = (id) => {
    for (let i = 0; i < yourOutfitPhoto.length; i++) {
      if (yourOutfitPhoto[i][0] === id) {
        return yourOutfitPhoto[i][1];
      }
    }
  };

  let getRatings = (id) => {
    for (let i = 0; i < yourOutfitRatings.length; i++) {
      if (yourOutfitRatings[i][0] === id) {
        return Number(yourOutfitRatings[i][1]);
      }
    }
  };

  if (yourOutfit.length === 0) {
    return (
      <div id="addOutfit">
        <h3 id="outfit-title">YOUR OUTFIT</h3>
        <div style={{display: 'flex', flexDirection: 'row'}} id="short-outfitList">
          <Carousel itemsToShow={4} showEmptySlots>
          <div id="outfit-button" onClick={addToYourOutfit}>+</div>
          </Carousel>
        </div>
      </div>
    )
  } else {
    return (
      <div>
      <h3 id="outfit-title">YOUR OUTFIT</h3>
        <div style={{display: 'flex', flexDirection: 'row'}}>
        <Carousel itemsToShow={4} showEmptySlots>
        <div id="outfit-button" onClick={addToYourOutfit}>+</div>
        {yourOutfit.map((outfit, i) => (
          <div id="yourOutfitCard" key={i}>
            <img id="yourOutfitImg" src={getImgSrc(outfit.id)} />
            <button id="remove-outfit" value={outfit.id} onClick={removeFromYourOutfit}>&#9447;</button>
            <div id="outfit-desc">
              <div id="yourOutfitCategory">{outfit.category}</div>
              <div id="yourOutfitName">{outfit.name}</div>
              <div id="yourOutfitPrice">${outfit.sale_price ? outfit.sale_price : outfit.default_price}</div>
              <Stars id="cardStars" avgRating={getRatings(outfit.id)} />
            </div>
          </div>
        ))}
        </Carousel>
        </div>
      </div>
    )
  }
}

export default YourOutfitList;