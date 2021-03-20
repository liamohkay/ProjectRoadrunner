/* ---------------------
Dependencies + Libraries
--------------------- */
const fs = require('fs');
const byline = require('byline');
const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/SDC`, { poolSize: 10, bufferMaxEntries: 0, useNewUrlParser: true, useUnifiedTopology: true });

// Helper function that creates obj for mongo collection instance
const getRowObj = (row, schema, Class) => {
  row = row.toString('utf-8').split(',');
  let instance = {};
  Object.keys(Object.values(schema)[0]).map((key, i) => instance[key] = row[i]);
  return instance;
}

/* -------------------------------------
Import reviews CSV & upload to collection
------------------------------------- */
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
const Review = mongoose.model('Review', reviewSchema);

let reviewStream = byline(fs.createReadStream('../data/reviews.csv', { encoding: 'utf8' }))

mongoose.connection.on('open', (err, conn) => {
  let counter = 0;
  let bulk = Review.collection.initializeOrderedBulkOp();

  reviewStream
    .on('error', (err) => console.log(err))
    .on('data', (row) => {
      counter++;
      row = row.toString('utf-8').split(',');
      bulk.insert(getRowObj(row, reviewSchema));

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
          console.log("Completed photo collection");
        });
      }
    });
});