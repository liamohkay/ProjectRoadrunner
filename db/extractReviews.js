// /* ---------------------
// Dependencies + Libraries
// --------------------- */
// const fs = require('fs');
// const byline = require('byline');
// const db = require('./index.js');
// const mongoose = require('mongoose');
// const Photo = db.Photo;
// const Review = db.Review;

// /* --------------------------------------------------------------
// Read in review CSV data and upload to database w/ embedded photos
// -------------------------------------------------------------- */
// let reviewStream = byline(fs.createReadStream('./data/reviews.csv', { encoding: 'utf8' }));

// mongoose.connection.on('open', (err, conn) => {
//   counter = 0;
//   console.time('reviews');
//   let bulk = Review.collection.initializeUnorderedBulkOp();

//   reviewStream
//     .on('error', (err) => console.log(err))
//     .on('data', async (row) => {
//       // Get photos & embed
//       row = row.toString('utf-8').split(',');
//       if (row[0] !== 'id') {
//         reviewStream.pause();
//         await Photo.find({ review_id: row[0] })
//           .lean()
//           .catch(err => console.log(err))
//           .then(photos => {
//             bulk.insert({
              // review_id: Number(row[0]),
              // product_id: row[1],
              // rating: Number(row[2]),
              // date: row[3].replace(/["]/g, ''),
              // summary: row[4].replace(/["]/g, ''),
              // body: row[5].replace(/["]/g, ''),
              // recommend: row[6] === 'TRUE' || row[6] === '1' ? true : false,
              // reported: row[7] === 'TRUE' || row[7] === '1' ? true : false,
              // reviewer_name: row[8].replace(/["]/g, ''),
              // reviewer_email: row[9].replace(/["]/g, ''),
              // response: row[10] === '' ? null : row[10].replace(/["]/g, ''),
              // helpfulness: Number(row[11]),
//               photos: photos
//             });

//             bulk.execute((err, result) => {
//               if (err) console.log(err);
//               bulk = Review.collection.initializeUnorderedBulkOp();
//               counter++;
//               if (counter % 100000 === 0) console.log(counter);
//               reviewStream.resume();
//             });
//           });
//       }
//     })
//     .on('end', () => {
//       console.log("Completed review collection");
//       console.time('reviews')
//       bulk.execute((err, result) => {
//         if (err) console.log(err);
//       });
//     });
// });

/* ---------------------
Dependencies + Libraries
--------------------- */
const fs = require('fs');
const byline = require('byline');
const db = require('./index.js');
const mongoose = require('mongoose');
const Photo = db.Photo;
const Review = db.Review;

/* --------------------------------------------------------------
Read in review CSV data and upload to database w/ embedded photos
-------------------------------------------------------------- */
let reviewStream = byline(fs.createReadStream('./data/reviews.csv', { encoding: 'utf8' }));

mongoose.connection.on('open', (err, conn) => {
  counter = 0;
  console.time('reviews');
  let bulk = Review.collection.initializeUnorderedBulkOp();

  reviewStream
    .on('error', (err) => console.log(err))
    .on('data', (row) => {
      counter++;
      row = row.toString('utf-8').split(',');

      bulk.insert({
        review_id: Number(row[0]),
        product_id: row[1],
        rating: Number(row[2]),
        date: row[3].replace(/["]/g, ''),
        summary: row[4].replace(/["]/g, ''),
        body: row[5].replace(/["]/g, ''),
        recommend: row[6] === 'TRUE' || row[6] === '1' ? true : false,
        reported: row[7] === 'TRUE' || row[7] === '1' ? true : false,
        reviewer_name: row[8].replace(/["]/g, ''),
        reviewer_email: row[9].replace(/["]/g, ''),
        response: row[10] === '' ? null : row[10].replace(/["]/g, ''),
        helpfulness: Number(row[11])
      });

      if (counter % 1000000 === 0) {
        console.log(counter);
      } else if (counter % 1000 === 0) {
        reviewStream.pause();
        bulk.execute((err, result) => {
          if (err) console.log(err);
          bulk = Review.collection.initializeUnorderedBulkOp();;
          reviewStream.resume();
        });
      }
    })
    .on('end', () => {
      if (counter % 1000 != 0) {
        bulk.execute((err, result) => {
          if (err) console.log(err);
          console.log("Completed photo collection");
          console.timeEnd('reviews');
          db.Connection.close();
        });
      }
    });
});
