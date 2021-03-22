/* ---------------------
Dependencies + Libraries
--------------------- */
const fs = require('fs');
const byline = require('byline');
const mongoose = require('mongoose');
const db = require('./index.js');
const Photo = db.Photo;

/* --------------------------------
Extract, transform, load photos CSV
-------------------------------- */
let photoStream = byline(fs.createReadStream('./data/reviews_photos.csv', { encoding: 'utf8' }))

db.Connection.on('open', err => {
  console.time('photos');
  let counter = 0;
  let bulk = Photo.collection.initializeUnorderedBulkOp();

  photoStream
    .on('error', (err) => console.log(err))
    .on('data', (row) => {
      counter++;
      row = row.toString('utf-8').split(',');

      bulk.insert({
        id: Number(row[0]),
        review_id: Number(row[1]),
        url: row[2].replace(/["]/g, '')
      });

      if (counter % 1000000 === 0) {
        console.log(counter);
      } else if (counter % 1000 === 0) {
        photoStream.pause();
        bulk.execute((err, result) => {
          if (err) console.log(err);
          bulk = Photo.collection.initializeUnorderedBulkOp();;
          photoStream.resume();
        });
      }
    })
    .on('end', () => {
      if (counter % 1000 != 0) {
        bulk.execute((err, result) => {
          if (err) console.log(err);
          console.log("Completed photo collection");
          console.timeEnd('photos');
          db.Connection.close();
        });
      }
    });
});