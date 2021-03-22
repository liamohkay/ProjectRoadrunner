/* -------------------------
Import config + dependencies
------------------------- */
const db = require('../db/index.js');
const mongoose = require('mongoose');
const DataFrame = require('dataframe-js').DataFrame;
const { Connection, CharacteristicReview, Characteristic, Photo, Review } = db;

/* -------------
Helper Functions
------------- */
const getCharacteristics = data => {
  // Map through all reviews + review scores for each characteristic
  characteristics = [];

  data.map(review => {
    let charObj = {};
    let charName = review.name
    let avgScore = { id: null, value: 0 };

    // Calc mean score for individual product characteristics
    review.characteristicReviews.map(charReview => {
      if (!avgScore.id) avgScore.id = charReview.characteristic_id;
      avgScore.value += charReview.value / review.characteristicReviews.length;
    });

    charObj[charName] = avgScore;
    characteristics.push(charObj);
  });

  return characteristics;
}

const getRatingsRecommended = data => {
  let recommended = { '0': 0, '1': 0 }
  let ratings = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };

  // Enumerate ratings & recommended
  data.map(row => {
    ratings[row.rating] += 1;
    if (row.recommend) {
      recommended['1'] += 1;
    } else {
      recommended['0'] += 1;
    }
  });

  return [ratings, recommended];
}

/* --------
Controllers
-------- */
module.exports = {

  // Retreives reviews for a specific product
  getReview: (req, res) => {
    const { product_id, page, count, sort } = req.query;
    const orderKey = sort !== 'helpful' ? 'date' : 'helpfulness';
    const orderBy = {};
    orderBy[orderKey] = -1;

    Review
      .find({ product_id: product_id })
      .sort(orderBy)
      .limit(Number(count))
      .catch(err => res.status(400).send(err))
      .then(data => {
        res.status(200).send({
          product: product_id,
          page: !page ? 0 : Number(page),
          count: !count ? 5 : Number(count),
          results: data
        });
      })
  },

  getMeta: (req, res) => {
    const { product_id } = req.query;
    Characteristic
      .find({ product_id: product_id })
      .catch(err => res.status(400).send(err))
      .then(charData => {

        // Aggregate mean char review scores
        let characteristics = getCharacteristics(charData);

        // Get rating & recommended from Review
        Review
          .find({ product_id: product_id })
          .select('rating recommend')
          .then(reviewData => {
            // Return characteristics obj to user
            let [ratings, recommended] = getRatingsRecommended(reviewData);
            res.status(200).send({
              product_id,
              ratings,
              recommended,
              characteristics
            });
          });

      });
  }

}