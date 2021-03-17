import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import header from '../../../../config.js';
import Stars from '../Reviews/Ratings/Stars.jsx';
import Carousel from 'react-elastic-carousel';
import styled from 'styled-components';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    zIndex: 12
  }
};

class RelatedItemCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      thumbnails: [],
      modalIsOpen: false,
      compareName: '',
      modalCompFeatures: [],
      compareFeatures: [],
      currentFeatures: [],
      filteredFeatures: []
    }
    this.getThumbnails = this.getThumbnails.bind(this)
    this.getCurrentFeatures = this.getCurrentFeatures.bind(this)
    this.getCompareFeatures = this.getCompareFeatures.bind(this)
    this.getThumbnail = this.getThumbnail.bind(this)
    this.getRating = this.getRating.bind(this)
    this.modalState = this.modalState.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.stylesData !== this.props.stylesData) {
      this.getThumbnails();
      this.getCurrentFeatures();
      this.getCompareFeatures();
    }
  }

  getThumbnails() {
    let thumbnailsArr = [];
    for (let i = 0; i < this.props.stylesData.length; i++) {
      thumbnailsArr.push([Number(this.props.stylesData[i].product_id), this.props.stylesData[i].results[0].photos[0].thumbnail_url])
    }
    this.setState({thumbnails: thumbnailsArr})
  }

  getCurrentFeatures() {
    this.setState({
      currentFeatures: this.props.currentProductFeatures.features
    })
  }

  getCompareFeatures() {
    this.setState({
      compareFeatures: this.props.dataArr.map(({id, name, features}) => ({id, name, features}))
    })
  }

  getThumbnail(id) {
    for (let i = 0; i < this.state.thumbnails.length; i++) {
      if (id === this.state.thumbnails[i][0]) {
        return this.state.thumbnails[i][1]
      }
    }
  };

  getRating(id) {
    if (this.props.relatedRatings.length > 0) {
      for (let i = 0; i < this.props.relatedRatings.length; i++) {
        if (id === Number(this.props.relatedRatings[i].id)) {
          return this.props.relatedRatings[i].rating
        }
      }
    } else {
      return 0;
    }
  };

  modalState(e) {
    let compFeat = [];
    this.state.compareFeatures.filter((item) => {
      if (item.id === Number(e.target.value)) {
        compFeat.push(item.features)
      }
    })
    const newCurrFeatures = this.state.currentFeatures.map((item) => ({...item, item: 0}))
    const newFeatures = compFeat[0].map((item) => ({...item, item: 1}))

    this.setState({
      modalIsOpen: true,
      compareName: e.target.name,
      currentFeatures: newCurrFeatures,
      modalCompFeatures: newFeatures
    }, () => {
      this.setState({
        filteredFeatures: this.state.currentFeatures.concat(this.state.modalCompFeatures).filter((feature, index, self) => {
          let temp = self.findIndex((i) => (i.feature === feature.feature && i.value === feature.value && i.item !== feature.item && i.item !== 2))
        if (temp > -1) {
          feature.item = 2;
          return true
        } else {
          let temp2 = self.findIndex((i) => (i.feature === feature.feature && i.value === feature.value)) === index
          if (temp2) {
            return true;
          }
          return false;
          }
          })
      })
    })
  }

  render() {
    if (this.props.stylesData.length === 0 || this.props.currentProductFeatures.length === 0) {
      return null
    } else {
      return (
        <div widgetname="related-products" style={{display: 'flex', flexDirection: 'row'}}>
        <Carousel widgetname="related-products" itemsToShow={4}>
        {this.props.dataArr.map((item, i) => (
          <div widgetname="related-products" id="relatedItemCard" key={i}>
            <img widgetname="related-products" id="related-img" onClick={() => (this.props.selectProduct(item.id))} src={this.getThumbnail(item.id)} />
            <button widgetname="related-products" id="star-button" name={item.name} value={item.id} onClick={this.modalState}>&#9734;</button>
            <div widgetname="related-products" id="related-desc">
              <div widgetname="related-products" id="cardCategory">{item.category}</div>
              <div widgetname="related-products" id="cardName">{item.name}</div>
              <div widgetname="related-products" id="cardPrice">${item.sale_price ? item.sale_price : item.default_price}</div>
              <Stars id="cardStars" avgRating={this.getRating(item.id)} />
            </div>
          </div>
        ))}
        </Carousel>
        <Modal widgetname="related-products"
          ariaHideApp={false}
          isOpen={this.state.modalIsOpen}
          style={customStyles}
          onRequestClose={() => (this.setState({modaIsOpen: false}))}>
          <h3 widgetname="related-products" id="comparing">Comparing</h3>
          <table widgetname="related-products" className="table">
            <thead widgetname="related-products">
              <tr widgetname="related-products">
                <th widgetname="related-products">{this.props.currentProductFeatures.name}</th>
                <th widgetname="related-products"></th>
                <th widgetname="related-products">{this.state.compareName}</th>
              </tr>
            </thead>
            <tbody widgetname="related-products">
              {
              this.state.filteredFeatures ?
                this.state.filteredFeatures.map((feat, i) => {
                  if (feat.value !== null) {
                    if (feat.item === 0) {
                      return (
                        <tr id="modal-features" key={i}>
                          <td>&#10004;</td>
                          <td>{feat.value} {feat.feature}</td>
                          <td></td>
                        </tr>
                      )
                    } else if (feat.item === 1) {
                      return (
                        <tr id="modal-features" key={i}>
                          <td></td>
                          <td>{feat.value} {feat.feature}</td>
                          <td>&#10004;</td>
                        </tr>
                      )
                    } else {
                      return (
                        <tr id="modal-features" key={i}>
                          <td>&#10004;</td>
                          <td>{feat.value} {feat.feature}</td>
                          <td>&#10004;</td>
                        </tr>
                      )
                    }
                  }
                })
              : null
              }
              </tbody>
        </table>
        <button widgetname="related-products" style={{textAlign: 'center'}} onClick={() => (this.setState({modalIsOpen: false}))}>Close</button>
      </Modal>
      </div>
    )
  }
  }
}

export default RelatedItemCard;