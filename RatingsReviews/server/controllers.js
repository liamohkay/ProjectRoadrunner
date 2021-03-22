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
    let productID = req.url.slice(1, req.url.length);
    db.Review.find({ product_id: productID })
      .then(data => {
        console.log(data);
        res.status(200).send(data);
      })
      .catch(err => console.log(err))
  }
}

// --> req --> express api --> dbquery --> db