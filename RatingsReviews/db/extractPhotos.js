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
  id: Number,
  review_id: Number,
  url: String
});
const Photo = mongoose.model('Photo', photoSchema);

let photoStream = byline(fs.createReadStream('./data/reviews_photos.csv', { encoding: 'utf8' }))

mongoose.connection.on('open', (err, conn) => {
  console.time('photos');
  let counter = 0;
  let bulk = Photo.collection.initializeOrderedBulkOp();

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

      if (counter % 1000000 === 0) console.log(counter);
      if (counter % 1000 === 0) {
        photoStream.pause();
        bulk.execute((err, result) => {
          if (err) console.log(err);
          bulk = Photo.collection.initializeOrderedBulkOp();;
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
        });
      }
    });
});