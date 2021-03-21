/* ---------------------
Dependencies + Libraries
--------------------- */
const fs = require('fs');
const byline = require('byline');
const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/SDC`, { poolSize: 10, bufferMaxEntries: 0, useNewUrlParser: true, useUnifiedTopology: true });

/* -------------
Mongoose Schemas
------------- */
const reviewSchema = mongoose.Schema({
  id: String,
  product_id: String,
  rating: String,
  date: String,
  summary: String,
  body: String,
  recommend: Boolean,
  reported: Boolean,
  reviewer_name: String,
  reviewer_email: String,
  response: String,
  helpfulness: String
});
const Review = mongoose.model('Review', reviewSchema);

const photoSchema = mongoose.Schema({
  photo_id: String,
  review_id: String,
  url: String
});
const Photo = mongoose.model('Photo', photoSchema);

// Helper function that creates obj for mongo collection instance
const getRowObj = (row, schema, Class) => {
  row = row.toString('utf-8').split(',');
  let instance = {};
  Object.keys(Object.values(schema)[0]).map((key, i) => instance[key] = row[i]);
  return instance;
}

/* --------------------------------------------------------------
Read in review CSV data and upload to database w/ embedded photos
-------------------------------------------------------------- */
let reviewStream = byline(fs.createReadStream('../data/reviews.csv', { encoding: 'utf8' }));

mongoose.connection.on('open', (err, conn) => {
  let counter = 0;
  let bulk = Review.collection.initializeUnorderedBulkOp();

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
          console.log("Completed review collection");
        });
      }
    });
});





// Get photos & embed
    //   if (row[0] !== 'id') {
    //     reviewStream.pause();
    //     await Photo.find({ review_id: row[0] })
    //       .lean()
    //       .catch(err => console.log(err))
    //       .then(photos => {
    //         bulk.insert({
    //           id: Number(row[0]),
    //           product_id: row[1],
    //           rating: Number(row[2]),
    //           date: row[3].replace('"', ''),
    //           summary: row[4].replace('"', ''),
    //           body: row[5].replace('"', ''),
    //           recommend: row[6] === 'TRUE' || row[6] === '1' ? true : false,
    //           reported: row[7] === 'TRUE' || row[7] === '1' ? true : false,
    //           reviewer_name: row[8].replace('"', ''),
    //           reviewer_email: row[9].replace('"', ''),
    //           response: row[10] === '' ? null : row[10].replace('"', ''),
    //           helpfulness: Number(row[11]),
    //           photos: photos
    //         });
    //         bulk.execute((err, result) => {
    //           if (err) console.log(err);
    //           bulk = Review.collection.initializeUnorderedBulkOp();;
    //           reviewStream.resume();
    //         });
    //       })
    //     }
    //   });
    // });