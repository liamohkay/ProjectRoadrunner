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
  id: String,
  characteristic_id: String,
  review_id: String,
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
      row = row.toString('utf-8').split(',');
      bulk.insert({
        id: row[0],
        characteristic_id: row[1],
        review_id: row[2]),
        value: row[3]
      });

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



//   .on('error', (err) => console.log(err))
//   .on('data', (row) => saveRow(row, photoSchema, Photo))
//   .on('end', () => console.log("Completed photos collection"))


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