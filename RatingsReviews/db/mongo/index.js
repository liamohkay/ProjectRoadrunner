/* ----------
Connect to DB
---------- */
const port = 27017;
const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/SDC`, {
  poolSize: 10,
  bufferMaxEntries: 0,
  useNewUrlParser:
  true,
  useUnifiedTopology: true
});
const connection = mongoose.connection
  .once('open', () => console.log(`SUCCESS: Connected to db on port: ${port}`))
  .on('error', () => console.log(`FAILED: Can't connect to db on port: ${port}`));

/* -------------
Database Schemas
------------- */
const charReviewSchema = mongoose.Schema({
  id: String,
  characteristic_id: String,
  review_id: String,
  value: String
});
const charSchema = mongoose.Schema({
  characteristic_id: String,
  product_id: String,
  name: String,
});
const photoSchema = mongoose.Schema({
  photo_id: String,
  review_id: String,
  url: String
});
const reviewSchema = mongoose.Schema({
  id: Number,
  product_id: String,
  rating: Number,
  date: String,
  summary: String,
  body: String,
  recommend: Boolean,
  reported: Boolean,
  reviewer_name: String,
  reviewer_email: String,
  response: String,
  helpfulness: Number
});

const CharactersticReview = mongoose.model('CharacteristicReview', charReviewSchema);
const Characterstic = mongoose.model('Characteristic', charSchema);
const Photo = mongoose.model('Photo', photoSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports = {
  Connection: connection,
  CharactersticReview: CharactersticReview,
  Characterstic: Characterstic,
  Photo: Photo,
  Review: Review
};