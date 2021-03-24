/* ---------------------
Dependencies + Libraries
--------------------- */
const fs = require('fs');
const byline = require('byline');
const db = require('./index.js');
const mongoose = require('mongoose');
const Characteristic = db.Characteristic;
const CharacteristicReview = db.CharacteristicReview;


/* -------------------------------------------------
Extract, transform, load characteristics reviews CSV
------------------------------------------------- */
let charReviewStream = byline(fs.createReadStream('./data/characteristic_reviews.csv', { encoding: 'utf8' }));

mongoose.connection.on('open', err => {
  console.time('charReviews');
  let counter = 0;
  let bulk = Characteristic.collection.initializeUnorderedBulkOp();

  charReviewStream
    .on('error', (err) => console.log(err))
    .on('data', (row) => {
      counter++;
      row = row.toString('utf-8').split(',');

      bulk.find({ characteristic_id: Number(row[1]) }).upsert().update({
        $push: {characteristicReviews: {
          id: Number(row[0]),
          characteristic_id: Number(row[1]),
          review_id: Number(row[2]),
          value: Number(row[3])
        }}
      });

      if (counter % 100000 === 0) {
        console.log(counter);
      } else if (counter % 1000 === 0) {
        charReviewStream.pause();
        bulk.execute((err, result) => {
          if (err) console.log(err);
          bulk = Characteristic.collection.initializeUnorderedBulkOp();
          charReviewStream.resume();
        });
      }
    })
    .on('end', () => {
      if (counter % 1000 !== 0) {
        bulk.execute((err, result) => {
          if (err) console.log(err);
          console.log("Completed characteristic reviews collection upsert");
          console.timeEnd('charReviews');
          db.Connection.close();
        });
      }
    });
});
