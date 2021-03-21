/* ---------------------
Dependencies + Libraries
--------------------- */
const fs = require('fs');
const mongoose = require('mongoose');
const DataFrame = require('dataframe-js').DataFrame;

const port = 27017;
const reviewsCols = [
  'id',
  'product_id',
  'rating',
  'date',
  'summary',
  'body',
  'recommend',
  'reported',
  'reviewer_name',
  'reviewer_email',
  'response',
  'helpfulness'
];

// Connect to db
mongoose.connect(`mongodb://localhost/SDC`, { useNewUrlParser: true } );
const db = mongoose.connection;
db.on('error', () => console.log(`FAILED: Can't connect to db on port: ${port}`));
db.once('open', () => console.log(`SUCCESS: Connected to db on port: ${port}`));

/* -----------------------------------------------
Metadata collection schema + load helper functions
----------------------------------------------- */
const metaSchema = mongoose.Schema({
  product_id: String,
  recommended: {},
  ratings: {},
  characteristics: {}
});
const Metadata = mongoose.model('Metadata', metaSchema);



reviewStream
.on('error', (err) => console.log(err))
.on('data', (row) => {
  counter++;
  row = row.toString('utf-8').split(',');
  let productID = row[]
  if (counter % 1000 === 0) {
    reviewStream.pause();
    bulk.execute((err, result) => {
      if (err) throw err;
      bulk = Review.collection.initializeOrderedBulkOp();;
      reviewStream.resume();
    });
  }

  if (counter % 1000000 === 0) {
    console.log(counter);
  }
})
.on('end', () => {
  if (counter % 1000 != 0) {
    bulk.execute((err, result) => {
      if (err) throw err;
      console.log("Completed review collection");
    });
  }
});
});
const Reviews = db.collection('reviews')
db.on('open', () => {
  // let test = Reviews.getIndexes()
  //   .then(test => console.log(test))
  db.collection('reviews').getIndexes()
    .then(test => console.log(test))

});