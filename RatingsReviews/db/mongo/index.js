
const mongoose = require('mongoose');
const port = 27017;

// Connect to db
mongoose.connect(`mongodb://localhost/SDC`, { useNewUrlParser: true } );
const db = mongoose.connection;
db.on('error', () => console.log(`FAILED: Can't connect to db on port: ${port}`));
db.once('open', () => console.log(`SUCCESS: Connected to db on port: ${port}`));

const metaSchema = mongoose.Schema({
  product_id: String,
  recommended: {},
  ratings: {},
  characteristics: {}
});
const Metadata = mongoose.model('Metadata', metaSchema);

const reviewsSchema = mongoose.Schema({
  product_id: String,
  results: []
});
const Review = mongoose.model('Review', reviewsSchema);

module.exports = {
  db,
  Metadata,
  Review
};