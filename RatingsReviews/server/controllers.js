/* -------------------------
Import config + dependencies
------------------------- */
const db = require('../db/index.js');
const mongoose = require('mongoose');
const DataFrame = require('dataframe-js').DataFrame;
const { Connection, Characteristic, Review } = db;

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

  // Retreives reviews for a specific product_id
  getReview: (req, res) => {
    const { product_id, page, count, sort } = req.query;
    const orderKey = sort !== 'helpful' ? 'date' : 'helpfulness';
    const orderBy = {};
    orderBy[orderKey] = -1;

    Review.find({ product_id: product_id }).sort(orderBy).limit(Number(count))
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

  // Gets metadata for a given product_id
  getMeta: (req, res) => {
    const { product_id } = req.query;

    // Aggregate mean char review scores
    Characteristic.find({ product_id: product_id })
      .catch(err => res.status(400).send(err))
      .then(charData => {
        let characteristics = getCharacteristics(charData);

        // Get rating & recommended from Review
        Review.find({ product_id: product_id }).select('rating recommend')
          .then(reviewData => {
            let [ratings, recommended] = getRatingsRecommended(reviewData);

            // Return structured resp to user
            res.status(200).send({
              product_id,
              ratings,
              recommended,
              characteristics
            });
          });

      });
  },

  // Posts a new review to the reviews collection
  postReview: (req, res) => {
    Review.find({}).lean().sort({ review_id: -1 }).limit(1).select('review_id -_id')
    .then(id => {
        id.map(val => {
          let body = req.body;
          body.review_id = val.review_id + 1;
          let newReview = new Review(body);
          newReview.save()
            .catch(err => res.status(400).send(err))
            .then(() => res.status(200).send())
        });
      });
  },

  // Increments the helpfulness score of a specific review_id
  putHelpful: (req, res) => {
    const { review_id } = req.params
    Review.findOneAndUpdate({ review_id: Number(review_id) }, {$inc: {'helpfulness': 1}})
      .catch(err => res.status(400).send(err))
      .then(() => res.status(204).send())
  }

}