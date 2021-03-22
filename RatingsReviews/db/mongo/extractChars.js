/* ---------------------
Dependencies + Libraries
--------------------- */
const fs = require('fs');
const byline = require('byline');
const db = require('./index.js');
const mongoose = require('mongoose');

/* ----------------------------------------------------------
Extract, transform, load characteristics CSV & embed reveiews
---------------------------------------------------------- */
let charStream = byline(fs.createReadStream('../data/characteristics.csv', { encoding: 'utf8' }))
db.Connection.on('open', (err, conn) => {
  let bulk = db.Characterstic.collection.initializeUnorderedBulkOp();
  charStream
    .on('error', (err) => console.log(err))
    .on('data', async (row) => {
      row = row.toString('utf-8').split(',');
      if (row[0] !== 'id') {
        charStream.pause();
        await db.CharactersticReview.find({ characteristic_id: row[0] })
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
              bulk = db.Characterstic.collection.initializeUnorderedBulkOp();
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