/* ---------------------
Dependencies + Libraries
--------------------- */
const fs = require('fs');
const byline = require('byline');
const db = require('./index.js');
const mongoose = require('mongoose');
const Characteristic = db.Characteristic;
const CharacteristicReview = db.CharacteristicReview;

/* ----------------------------------------------------------
Extract, transform, load characteristics CSV & embed reveiews
---------------------------------------------------------- */
let charStream = byline(fs.createReadStream('./data/characteristics.csv', { encoding: 'utf8' }))

db.Connection.on('open', (err, conn) => {
  console.time('characteristics');
  let bulk = Characteristic.collection.initializeUnorderedBulkOp();

  charStream
    .on('error', (err) => console.log(err))
    .on('data', async (row) => {
      row = row.toString('utf-8').split(',');
      if (row[0] !== 'id') {
        charStream.pause();
        await CharacteristicReview.find({ characteristic_id: row[0] })
          .lean()
          .catch(err => console.log(err))
          .then(data => {
            bulk.insert({
              characteristic_id: Number(row[0]),
              product_id: row[1],
              name: row[2].replace(/["]/g, ''),
              characteristicReviews: data
            });

            bulk.execute((err, result) => {
              if (err) console.log(err.writeErrors[0]);
              bulk = Characteristic.collection.initializeUnorderedBulkOp();
              charStream.resume();
            });
          })
        }
    })
    .on('end', () => {
      bulk.execute((err, result) => {
        if (err) console.log(err);
        console.log("Completed characteristic collection");
        console.timeEnd('characteristics');
        db.Connection.close();
      })
    })
})