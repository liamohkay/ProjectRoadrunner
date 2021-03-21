/* ---------------------
Dependencies + Libraries
--------------------- */
const fs = require('fs');
const byline = require('byline');
const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/SDC`, { poolSize: 10, bufferMaxEntries: 0, useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
const CharacteristicReviews = db.collection('characteristicreviews');

// Helper function that creates obj for mongo collection instance
const getRowObj = (row, schema) => {
  row = row.toString('utf-8').split(',');
  let instance = {};
  Object.keys(Object.values(schema)[0]).map((key, i) => instance[key] = row[i]);
  return instance;
}

/* ----------------------------------------------
Import characteristics CSV & upload to collection
---------------------------------------------- */
const charReviewSchema = mongoose.Schema({
  id: String,
  characteristic_id: String,
  review_id: String,
  value: String
});
const CharactersticReview = mongoose.model('CharacteristicReview', charReviewSchema);

const charSchema = mongoose.Schema({
  characteristic_id: String,
  product_id: String,
  name: String,
});
const Characterstic = mongoose.model('Characteristic', charSchema);

let charStream = byline(fs.createReadStream('../data/characteristics.csv', { encoding: 'utf8' }))
mongoose.connection.on('open', (err, conn) => {
  let bulk = Characterstic.collection.initializeUnorderedBulkOp();
  charStream
    .on('error', (err) => console.log(err))
    .on('data', async (row) => {
      row = row.toString('utf-8').split(',');
      if (row[0] !== 'id') {
        charStream.pause();
        await CharactersticReview.find({ characteristic_id: row[0] })
          .lean()
          .catch(err => console.log(JSON.stringify(err.writeErrors)))
          .then(data => {
            bulk.insert({
              characteristic_id: row[0],
              product_id: row[1],
              name: row[2],
              characteristicReviews: data
            });
            bulk.execute((err, result) => {
              if (err) console.log(err.writeErrors[0]);
              bulk = Characterstic.collection.initializeUnorderedBulkOp();
              charStream.resume();
            });
          })
        }
    })
    .on('end', () => {
      if (bulk.length % 20 != 0) {
        bulk.execute((err, result) => {
          if (err) console.log(err);
          console.log("Completed characteristic collection");
        })
      }
    })
  })