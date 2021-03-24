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
  counter = 0;
  console.time('characteristics');
  let bulk = Characteristic.collection.initializeUnorderedBulkOp();

  charStream
    .on('error', (err) => console.log(err))
    .on('data', (row) => {
      counter++;
      row = row.toString('utf-8').split(',');

      bulk.insert({
        characteristic_id: Number(row[0]),
        product_id: row[1],
        name: row[2].replace(/["]/g, '')
      });

      if (counter % 1000000 === 0) {
        console.log(counter);
      } else if (counter % 1000 === 0) {
        charStream.pause();
        bulk.execute((err, result) => {
          if (err) console.log(err);
          bulk = Characteristic.collection.initializeUnorderedBulkOp();;
          charStream.resume();
        });
      }
    })
    .on('end', () => {
      if (counter % 1000 != 0) {
        bulk.execute((err, result) => {
          if (err) console.log(err);
          console.log("Completed characteristic collection");
          console.timeEnd('characteristics');
          db.Connection.close();
        });
      }
    });
})