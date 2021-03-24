/* ----------
Connect to DB
---------- */
const port = 27017;
const mongoose = require('mongoose');
// mongodb://localhost:27017/SDC
mongoose.connect(`mongodb://liam:password@54.183.165.57/SDC`, {
  poolSize: 10,
  bufferMaxEntries: 0,
  useNewUrlParser:
  true,
  useUnifiedTopology: true
});
const connection = mongoose.connection
  .once('open', () => console.log(`SUCCESS: Connected to db on port: ${port}`))
  .on('error', () => console.log(`FAILED: Can't connect to db on port: ${port}`));

/* ----------------------
Database Schemas & Models
---------------------- */
const charReviewSchema = mongoose.Schema({
  id: Number,
  characteristic_id: { type: Number, sparse: true },
  review_id: Number,
  value: Number,
});
const charSchema = mongoose.Schema({
  characteristic_id: { type: Number, sparse: true },
  product_id: { type: String, sparse: true },
  name: String,
  characteristicReviews: [charReviewSchema]
});
const photoSchema = mongoose.Schema({
  photo_id: Number,
  review_id: { type: Number, sparse: true },
  url: String
});
const reviewSchema = mongoose.Schema({
  review_id: { type: Number, sparse: true },
  product_id: { type: String, sparse: true },
  rating: Number,
  date: String,
  summary: String,
  body: String,
  recommend: Boolean,
  reported: Boolean,
  reviewer_name: String,
  reviewer_email: String,
  response: String,
  helpfulness: Number,
  photos: [photoSchema]
});

const CharacteristicReview = mongoose.model('CharacteristicReview', charReviewSchema);
const Characteristic = mongoose.model('Characteristic', charSchema);
const Photo = mongoose.model('Photo', photoSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports = {
  Connection: connection,
  CharacteristicReview,
  Characteristic,
  Photo,
  Review
};