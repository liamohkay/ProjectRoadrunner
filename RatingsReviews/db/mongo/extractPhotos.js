/* ---------------------
Dependencies + Libraries
--------------------- */
const fs = require('fs');
const byline = require('byline');
const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/SDC`, { poolSize: 10, bufferMaxEntries: 0, useNewUrlParser: true, useUnifiedTopology: true });

/* -------------------------------------
Import photos CSV & upload to collection
------------------------------------- */
const photoSchema = mongoose.Schema({
  photo_id: String,
  review_id: String,
  url: String
});
const Photo = mongoose.model('Photo', photoSchema);

let photoStream = byline(fs.createReadStream('../data/reviews_photos.csv', { encoding: 'utf8' }))

mongoose.connection.on('open', (err, conn) => {
  let counter = 0;
  let bulk = Photo.collection.initializeOrderedBulkOp();

  photoStream
    .on('error', (err) => console.log(err))
    .on('data', (row) => {
      counter++;
      row = row.toString('utf-8').split(',');
      bulk.insert({
        photo_id: row[0],
        review_id: row[1],
        url: row[2].replace('"', '')
      });

      if (counter % 1000000 === 0) console.log(counter);
      if (counter % 1000 === 0) {
        photoStream.pause();
        bulk.execute((err, result) => {
          if (err) throw err;
          bulk = Photo.collection.initializeOrderedBulkOp();;
          photoStream.resume();
        });
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