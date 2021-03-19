const fs = require('fs');
const parse = require('csv-parse');
const mongoose = require('mongoose');
const DataFrame = require('dataframe-js').DataFrame;
const port = 27017;

// Connect to db
mongoose.connect(`mongodb://localhost/SDC`, { useNewUrlParser: true } );
const db = mongoose.connection;
db.on('error', () => console.log(`FAILED: Can't connect to db on port: ${port}`));
db.once('open', () => console.log(`SUCCESS: Connected to db on port: ${port}`));

// Mongoose schema
// const metaSchema = mongoose.Schema({
//   product_id: Number,
//   recommended: {
//     0: Number,
//     1: Number
//   },
//   ratings: {
//     5: Number,
//     4: Number,
//     3: Number,
//     2: Number,
//     1: Number
//   },
//   characteristics: {}
// });
const metaSchema = mongoose.Schema({
  product_id: String,
  recommended: {},
  ratings: {},
  characteristics: {}
});

const Metadata = mongoose.model('Metadata', metaSchema);
const reviewsCols = [
  'id',
  'product_id',
  'rating',
  'date',
  'summary',
  'body',
  'recommend',
  'reported',
  'reviewer_name',
  'reviewer_email',
  'response',
  'helpfulness'
];

// Reads in csv file as readstream & returns dataframe class of csv data
const csvToDF = (filepath, colnames, callback) => {
  let chunks = [];
  fs.createReadStream(filepath)
    .on('error', (err) => console.log(err))
    .pipe(parse())
    .on('data', (row) => chunks.push(row))
    .on('end', () => callback(new DataFrame(chunks, colnames)))
}

// Creates product_id indexed nested obj w/ all characterstic names + ratings
const createCharacterstics = (charMergeDF, productID) => {
  charMergeDF = charMergeDF.filter(row => row.get('product_id') === productID).toDict();
  return {
    name: charMergeDF.name,
    id: charMergeDF.characteristic_id,
    value: charMergeDF.values
  };
}

// Creates ratings obj for metadata schema
const createRatings = (reviewsDF, productID) => {
  let ratings = reviewsDF.filter(row => row.get('product_id') === productID).toDict();
  return {
    reviewID: ratings.id,
    rating: ratings.rating
  }
}

// Creates recommended obj for metadata schema
const createRecommended = (reviewsDF, productID) => {
  let recommended = reviewsDF.filter(row => row.get('product_id') === productID).toDict();
  return {
    reviewID: recommended.id,
    recommend: recommended.recommend
  }
}

// Creates an instance for the metadata schema & saves it to db
const saveMeta = (reviewsDF, charMergeDF, product_id) => {
  let ratings = createRatings(reviewsDF, product_id);
  let recommended = createRecommended(reviewsDF, product_id);
  let characteristics = createCharacterstics(charMergeDF, product_id);
  let metaInstance = new Metadata({
    product_id,
    ratings,
    recommended,
    characteristics
  });

  metaInstance.save(err => {
    if (err) {
      console.log(err);
    }
  });
};
// console.log(JSON.stringify(ratings));
// console.log(JSON.stringify(recommended));
// console.log(JSON.stringify(metaInstance));

// Import all csv files as dataframes
csvToDF('../data/cReviewsTest.csv', ['id', 'characteristic_id', 'review_id', 'values'], charsReviewsDF => {
  csvToDF('../data/rPhotoTest.csv', ['id','review_id', 'url'], photosDF => {
    csvToDF('../data/cTest.csv', ['id', 'product_id', 'name'], charsDF => {
      csvToDF('../data/rTest.csv', reviewsCols , reviewsDF => {
        // reviewsDF.show();
        // ratingsDF.show();
        // photosDF.show();
        // charsDF.show();

        // Drop any duplicates from all dataframes
        charsReviewsDF = charsReviewsDF.filter(row => row.get('id') !== 'id').dropDuplicates();
        reviewsDF = reviewsDF.filter(row => row.get('id') !== 'id').dropDuplicates();
        photosDF = photosDF.filter(row => row.get('id') !== 'id').dropDuplicates();
        charsDF = charsDF.filter(row => row.get('id') !== 'id').dropDuplicates();

        // Transoform malformed / incomplete data
        reviewsDF = reviewsDF.chain(
          row => row.set('recommend', row.get('recommend') === 'TRUE' || row.get('recommend') === '1' ? 1 : 0),
          row => row.set('reported', row.get('reported') === 'TRUE' || row.get('reported') === '1' ? 1 : 0),
          row => row.set('response', row.get('response') === '' ? null : row.get('response'))
        )

        // Merge data for meta schema
        charsDF = charsDF.rename('id', 'characteristic_id');
        let charMergeDF = charsDF.join(charsReviewsDF, 'characteristic_id', 'inner')
        // console.log(JSON.stringify(createRecommended(reviewsDF, '1')));

        saveMeta(reviewsDF, charMergeDF, '1');
      })
    });
  });
});

 // reviewIDs.map(id => {
//   let names = reviewDF.unique('name').toArray();
//   let reviewIDs = productDF.unique('review_id').toArray();

//   let reviewObj = productDF
//     .filter(row => row.get('review_id') === id[0])
//     .drop('product_id')
//     .drop('id')
//     .drop('review_id')
//     .toDict()
//   console.log(JSON.stringify(reviewObj));
//   console.log(Object.values(reviewObj));
//   names.map(name => {
//     let review = {};
//     review[name[0]] = {
//       id: group.characteristic_id,
//       value: group.values
//     };
//     allReviews.characteristics[id] = review;
//   });
// });

// Aggregate data for meta schema
// let ratingsAggDF = reviewsDF.groupBy('product_id', 'characteristic_id')
//   .aggregate(group => group.count('id'))
// let recAggDF = reviewsDF.groupBy('product_id', 'recommend')
//   .aggregate(group => group.count('recommend'))
//   .rename('aggregation', 'count')