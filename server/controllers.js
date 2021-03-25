/* -------------------------
Import config + dependencies
------------------------- */
const db = require('../db/index.js');
const mongoose = require('mongoose');
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
    Review.count()
    .then(id => {
      let body = req.body;
      let characteristics = body.characteristics;
      delete body.characteristics;
      body.review_id = id + 1;

      // Parse out individual character reviews for embedded insert
      let charBulk = Characteristic.collection.initializeUnorderedBulkOp();
      for (charID in characteristics) {
      charBulk.find({ characteristic_id: Number(charID) }).update({
          $push: { characteristicReviews: {
            id: Number(charID),
            characteristic_id: Number(charID),
            review_id: id + 1,
            value: characteristics[charID]
          }}
        });
      }

      // Insert char reviews & create new review as well
      charBulk.execute()
        .catch(err => res.status(400).send(err))
        .then(() => {
          let newReview = new Review(body);
          console.log(body);
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
  },

  putReport: (req, res) => {
    const { review_id } = req.params
    Review.findOneAndUpdate({ review_id: Number(review_id) }, { reported: true })
      .catch(err => res.status(400).send(err))
      .then(() => res.status(204).send())
  }

}