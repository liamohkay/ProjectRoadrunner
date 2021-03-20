/* ---------------------
Dependencies + Libraries
--------------------- */
const fs = require('fs');
const byline = require('byline');
const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/SDC`, { poolSize: 10, bufferMaxEntries: 0, useNewUrlParser: true, useUnifiedTopology: true });

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
const charSchema = mongoose.Schema({
  id: Number,
  product_id: String,
  name: String
});
const Characterstic = mongoose.model('Characteristic', charSchema);
let charStream = byline(fs.createReadStream('../data/characteristics.csv', { encoding: 'utf8' }))

mongoose.connection.on('open', (err, conn) => {
  let counter = 0;
  let bulk = Characterstic.collection.initializeOrderedBulkOp();

  charStream
    .on('error', (err) => console.log(err))
    .on('data', (row) => {
      counter++;
      row = row.toString('utf-8').split(',');
      bulk.insert({
        id: Number(row[0]),
        product_id: Number(row[1]),
        name: row[2]
      });

      if (counter % 1000 === 0) {
        charStream.pause();
        bulk.execute((err, result) => {
          if (err) throw err;
          bulk = Characterstic.collection.initializeOrderedBulkOp();
          charStream.resume();
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
          console.log("Completed characteristic collection");
        });
      }
    });
});