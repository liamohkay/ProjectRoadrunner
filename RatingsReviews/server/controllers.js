/* -------------------------
Import config + dependencies
------------------------- */
const db = require('../db/mongo/index.js');

// GET /reviews/?queryparams
// GET /reviews/meta
// POST /reviews
// PUT /reviews/:review_id/helpful
// PUT /reviews/:review_id/report
module.exports = {
  getReview: (req, res) => {
    const { product_id, page, count, sort } = req.query;
    const orderKey = sort !== 'helpful' ? 'date' : 'helpfulness';
    const orderBy = {};
    orderBy[orderKey] = -1;

    db.Review
      .find({ product_id: product_id })
      .sort(orderBy)
      .limit(Number(count))
      .catch(err => res.status(400).send(err))
      .then(results => {
        res.status(200).send({
          product: product_id,
          page: !page ? 0 : Number(page),
          count: !count ? 5 : Number(count),
          results: results
        });
      })
  }
}