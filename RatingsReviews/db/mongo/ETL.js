const fs = require('fs');
const parse = require('csv-parse');
const DataFrame = require('dataframe-js').DataFrame;

// 2 schemas
// - reviews
// - metadata

// start with metadata cause it's easier
const csvToDF = (filepath, colnames, callback) => {
  let chunks = [];
  fs.createReadStream(filepath)
    .on('error', (err) => console.log(err))
    .pipe(parse())
    .on('data', (row) => chunks.push(row))
    .on('end', () => callback(new DataFrame(chunks, colnames)))
}



csvToDF('../data/test.csv', ['id', 'characteristic_id', 'review_id', 'values'], ratingsDF => {
  ratingsDF.show();
  const groupDF = ratingsDF.groupBy('characteristic_id', 'values')
    .aggregate(group => group.count('id'))
  // groupDF.show(5);



});


/* --- id --- characteristic_id --- review_id --- value ---*/
// {
//   "product_id": "2",
//   "ratings": {
//     2: 1,
//     3: 1,
//     4: 2,
//     // ...
//   },
//   "recommended": {
//     0: 5
//     // ...
//   },
//   "characteristics": {
//     "Size": {
//       "id": 14,
//       "value": "4.0000"
//     },
//     "Width": {
//       "id": 15,
//       "value": "3.5000"
//     },
//     "Comfort": {
//       "id": 16,
//       "value": "4.0000"
//     },
//     // ...
// }