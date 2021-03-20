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

/* -----------------------------------------------------
Import characteristic reviews CSV & upload to collection
----------------------------------------------------- */
const charReviewSchema = mongoose.Schema({
  id: Number,
  characteristic_id: Number,
  review_id: Number,
  value: String
});
const CharactersticReview = mongoose.model('CharacteristicReview', charReviewSchema);
let charReviewStream = byline(fs.createReadStream('../data/characteristic_reviews.csv', { encoding: 'utf8' }));

mongoose.connection.on('open', (err, conn) => {
  let counter = 0;
  let bulk = CharactersticReview.collection.initializeOrderedBulkOp();

  charReviewStream
    .on('error', (err) => console.log(err))
    .on('data', (row) => {
      counter++;
      bulk.insert(getRowObj(row, charReviewSchema));

      if (counter % 1000 === 0) {
        charReviewStream.pause();
        bulk.execute((err, result) => {
          if (err) throw err;
          bulk = CharactersticReview.collection.initializeOrderedBulkOp();;
          charReviewStream.resume();
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
          console.log("Completed characteristic reviews collection");
        });
      }
    });
});

/* ----------------------------------------------
Import characteristics CSV & upload to collection
---------------------------------------------- */
// const charSchema = mongoose.Schema({
//   id: Number,
//   product_id: String,
//   name: String
// });
// const Characterstic = mongoose.model('Characteristic', charSchema);

// byline(fs.createReadStream('../data/characteristics.csv', { encoding: 'utf8' }))
//   .on('error', (err) => console.log(err))
//   .on('data', (row) => saveRow(row, charSchema, Characterstic))
//   .on('end', () => console.log("Completed characteristics collection"))

// /* -------------------------------------
// Import photos CSV & upload to collection
// ------------------------------------- */
// const photoSchema = mongoose.Schema({
//   id: Number,
//   review_id: Number,
//   name: String
// });
// const Photo = mongoose.model('Photo', photoSchema);

// byline(fs.createReadStream('../data/reviews_photos.csv', { encoding: 'utf8' }))
//   .on('error', (err) => console.log(err))
//   .on('data', (row) => saveRow(row, photoSchema, Photo))
//   .on('end', () => console.log("Completed photos collection"))

// /* -------------------------------------
// Import reviews CSV & upload to collection
// ------------------------------------- */
// const reviewSchema = mongoose.Schema({
//   id: Number,
//   product_id: String,
//   rating: Number,
//   date: String,
//   summary: String,
//   body: String,
//   recommend: Boolean,
//   reported: Boolean,
//   reviewer_name: String,
//   reviewer_email: String,
//   response: String,
//   helpfulness: Number
// });
// const Review = mongoose.model('Review', reviewSchema);


// byline(fs.createReadStream('../data/reviews.csv', { encoding: 'utf8' }))
//   .on('error', (err) => console.log(err))
//   .on('data', (row) => {
//     let instance = {};
//     Object.keys(Object.values(reviewSchema)[0]).map((key, i) => instance[key] = row[i]);

//     // Clean up a few rows
//     instance.recommend = instance.recommend === 'TRUE' || instance.recommend === '1' ? 1 : 0;
//     instance.reported = instance.reported === 'TRUE' || instance.recommend === '1' ? 1 : 0;
//     instance.response = instance.response === '' || instance.recommend === '1' ? null : instance.response;

//     let document = new Review(instance);
//     document.save(err => {
//       if (err) {
//         console.log(err);
//       }
//     });
//   })
//   .on('end', () => console.log("Completed review collection"))