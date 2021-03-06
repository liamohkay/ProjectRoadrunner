/* ---------------------
Dependencies + Libraries
--------------------- */
const fs = require('fs');
const byline = require('byline');
const mongoose = require('mongoose');
const db = require('./index.js');
const Review = db.Review;


/* --------------------------------
Extract, transform, load photos CSV
-------------------------------- */
let photoStream = byline(fs.createReadStream('./data/reviews_photos.csv', { encoding: 'utf8' }))

db.Connection.on('open', err => {
  console.time('photos');
  let counter = 0;
  let bulk = Review.collection.initializeUnorderedBulkOp();

  photoStream
    .on('error', (err) => console.log(err))
    .on('data', (row) => {
      counter++;
      row = row.toString('utf-8').split(',');

      bulk.find({ review_id: Number(row[1]) }).upsert().update({
        $push: {photos: {
          id: Number(row[0]),
          review_id: Number(row[1]),
          url: row[2].replace(/["]/g, '')
        }}
      });

      if (counter % 100000 === 0) {
        console.log(counter);
      } else if (counter % 1000 === 0) {
        photoStream.pause();
        bulk.execute((err, result) => {
          if (err) console.log(err);
          bulk = Review.collection.initializeUnorderedBulkOp();;
          photoStream.resume();
        });
      }
    })
    .on('end', () => {
      if (counter % 1000 != 0) {
        bulk.execute((err, result) => {
          if (err) console.log(err);
          console.log("Completed photos upsert");
          console.timeEnd('photos');
          db.Connection.close();
        });
      }
    });
});