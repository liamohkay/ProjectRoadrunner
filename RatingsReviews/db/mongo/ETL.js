/* ---------------------
Dependencies + Libraries
--------------------- */
const fs = require('fs');
const parse = require('csv-parse');
const mongoose = require('mongoose');
const DataFrame = require('dataframe-js').DataFrame;
// const db = require('./index.js');
const port = 27017;
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

// Connect to db
mongoose.connect(`mongodb://localhost/SDC`, { useNewUrlParser: true } );
const db = mongoose.connection;
db.on('error', () => console.log(`FAILED: Can't connect to db on port: ${port}`));
db.once('open', () => console.log(`SUCCESS: Connected to db on port: ${port}`));

/* -----------------------------------------------
Metadata collection schema + load helper functions
----------------------------------------------- */
const metaSchema = mongoose.Schema({
  product_id: String,
  recommended: {},
  ratings: {},
  characteristics: {}
});
const Metadata = mongoose.model('Metadata', metaSchema);

// Creates product_id indexed nested obj w/ all characterstic names + ratings
const createCharacterstics = (charMergeDF, product_id) => {
  charMergeDF = charMergeDF.filter(row => row.get('product_id') === product_id).toDict();
  return {
    name: charMergeDF.name,
    id: Number(charMergeDF.characteristic_id),
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
const createRecommended = (reviewsDF, product_id) => {
  let recommended = reviewsDF.filter(row => row.get('product_id') === product_id).toDict();
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

  // Save instance to DB
  metaInstance.save(err => {
    if (err) {
      console.log(err);
    }
  });
};

/* ----------------------------------------------
Reviews collection schema + load helper functions
---------------------------------------------- */
// const reviewsSchema = mongoose.Schema({
//   product_id: String,
//   results: []
// });
// const Review = mongoose.model('Review', reviewsSchema);

// Given an review_id, returns array of objects containing review picture URLs
const createPhotos = (photosDF, review_id) => {
  let photos = photosDF.filter(row => row.get('review_id') === review_id)
  let photoIDs = photos.unique('id').toArray();
  let results = [];

  photoIDs.map(id => {
    let photo = photos.filter(row => row.get('id') === id[0]).toDict();
    results.push({
      id: Number(id[0]),
      url: photo.url[0]
    });
  });

  return results;
}

// Given a product id, will save entire /reivews/:product_id info w/ pictures to mongo db
// indexed by product_id
const saveReviews = (reviewsDF, photosDF, product_id) => {
  let reviews = reviewsDF.filter(row => row.get('product_id') === product_id);
  let reviewIDs = reviews.unique('id').toArray();
  let results = [];

  // Map through all reviews for given product id and store as array of objects
  reviewIDs.map(id => {
    let review = reviews.filter(row => row.get('id') === id[0]).toDict();
    results.push({
      review_id: Number(review.id[0]),
      rating: review.rating[0],
      summary: review.summary[0],
      response: review.response[0],
      body: review.body[0],
      date: review.date[0],
      reviewer_name: review.reviewer_name[0],
      helpfulness: review.helpfulness[0],
      photos: createPhotos(photosDF, id[0])
    });
  });

  let reviewInstance = new Review({
    product_id,
    results
  });

  // Save review instance to review collection
  reviewInstance.save(err => {
    if (err) {
      console.log(err);
    }
  })
};

// Helper function that saves rows to mongo collection
const saveRow = (row, schema, Class) => {
  let instance = {};
  Object.keys(Object.values(schema)[0]).map((key, i) => instance[key] = row[i]);
  let document = new Class(instance);
  document.save(err => {
    if (err) {
      console.log(err);
    }
  });
}

/* -----------------------------------------------------
Import characteristic reviews CSV & upload to collection
----------------------------------------------------- */
// fs.createReadStream('../data/characteristic_reviews.csv')
const charReviewSchema = mongoose.Schema({
  id: Number,
  characteristic_id: Number,
  review_id: Number,
  value: String
});
const CharactersticReview = mongoose.model('CharacteristicReview', charReviewSchema);

fs.createReadStream('../data/cReviewsTest.csv')
  .pipe(parse())
  .on('error', (err) => console.log(err))
  .on('data', (row) => saveRow(row, charReviewSchema, CharactersticReview))
  .on('end', () => console.log("Completed characteristic reviews collection"))

/* -----------------------------------------------------
Import characteristic reviews CSV & upload to collection
----------------------------------------------------- */
// fs.createReadStream('../data/characteristic_reviews.csv')
// const charReviewSchema = mongoose.Schema({
//   id: Number,
//   characteristic_id: Number,
//   review_id: Number,
//   value: String
// });
// const CharactersticReview = mongoose.model('CharacteristicReview', charReviewSchema);

// fs.createReadStream('../data/cReviewsTest.csv')
//   .pipe(parse())
//   .on('error', (err) => console.log(err))
//   .on('data', (row) => saveRow(row, charReviewSchema, CharactersticReview))
//   .on('end', () => console.log("Completed characteristic reviews collection"))

/* ----------------------------------------------
Import characteristics CSV & upload to collection
---------------------------------------------- */
// const charSchema = mongoose.Schema({
//   id: Number,
//   product_id: String,
//   name: String
// });
// const Characterstic = mongoose.model('Characteristic', charSchema);

// fs.createReadStream('../data/cTest.csv')
//   .pipe(parse())
//   .on('error', (err) => console.log(err))
//   .on('data', (row) => saveRow(row, charSchema, Characterstic))
//   .on('end', () => console.log("Completed characteristics collection"))

/* -------------------------------------
Import photos CSV & upload to collection
------------------------------------- */
// const photoSchema = mongoose.Schema({
//   id: Number,
//   review_id: Number,
//   name: String
// });
// const Photo = mongoose.model('Photo', photoSchema);

// fs.createReadStream('../data/cTest.csv')
//   .pipe(parse())
//   .on('error', (err) => console.log(err))
//   .on('data', (row) => saveRow(row, photoSchema, Photo))
//   .on('end', () => console.log("Completed photos collection"))

/* -------------------------------------
Import reviews CSV & upload to collection
------------------------------------- */
const reviewSchema = mongoose.Schema({
  id: Number,
  product_id: String,
  rating: Number,
  date: String,
  summary: String,
  body: String,
  recommend: Boolean,
  reported: Boolean,
  reviewer_name: String,
  reviewer_email: String,
  response: String,
  helpfulness: Number
});
const Review = mongoose.model('Review', reviewSchema);

fs.createReadStream('../data/rTest.csv')
  .pipe(parse())
  .on('error', (err) => console.log(err))
  .on('data', (row) => {
    let instance = {};
    Object.keys(Object.values(reviewSchema)[0]).map((key, i) => instance[key] = row[i]);

    // Clean up a few rows
    instance.recommend = instance.recommend === 'TRUE' || instance.recommend === '1' ? 1 : 0;
    instance.reported = instance.reported === 'TRUE' || instance.recommend === '1' ? 1 : 0;
    instance.response = instance.response === '' || instance.recommend === '1' ? null : instance.response;

    let document = new Review(instance);
    document.save(err => {
      if (err) {
        console.log(err);
      }
    });


  })
  .on('end', () => console.log("Completed review collection"))





// // Reads in csv file as readstream & returns dataframe class of csv data
// const csvToDF = (filepath, colnames, callback) => {
//   let chunks = [];
//   fs.createReadStream(filepath)
//     .on('error', (err) => console.log(err))
//     .pipe(parse())
//     .on('data', (row) => chunks.push(row))
//     .on('end', () => callback(new DataFrame(chunks, colnames)))
// }

// // Import all csv files as dataframes
// csvToDF('../data/characteristic_reviews.csv', ['id', 'characteristic_id', 'review_id', 'values'], charsReviewsDF => {
//   csvToDF('../data/reviews_photos.csv', ['id','review_id', 'url'], photosDF => {
//     csvToDF('../data/characteristics.csv', ['id', 'product_id', 'name'], charsDF => {
//       csvToDF('../data/reviews.csv', reviewsCols , reviewsDF => {
//         console.log("Dataframes loaded");

//         // Drop any duplicates from all dataframes
//         // charsReviewsDF = charsReviewsDF.filter(row => row.get('id') !== 'id').dropDuplicates();
//         // reviewsDF = reviewsDF.filter(row => row.get('id') !== 'id').dropDuplicates();
//         // photosDF = photosDF.filter(row => row.get('id') !== 'id').dropDuplicates();
//         // charsDF = charsDF.filter(row => row.get('id') !== 'id').dropDuplicates();

//         // Transoform malformed / incomplete data
//         reviewsDF = reviewsDF.chain(
//           row => row.set('recommend', row.get('recommend') === 'TRUE' || row.get('recommend') === '1' ? 1 : 0),
//           row => row.set('reported', row.get('reported') === 'TRUE' || row.get('reported') === '1' ? 1 : 0),
//           row => row.set('response', row.get('response') === '' ? null : row.get('response'))
//         )

//         // Merge data for metadata schema
//         charsDF = charsDF.rename('id', 'characteristic_id');
//         let charMergeDF = charsDF.join(charsReviewsDF, 'characteristic_id', 'inner')

//         // Create db instances for every product id + store
//         let productIDs = reviewsDF.unique('product_id').toArray();
//         productIDs.map(id => {
//           saveMeta(reviewsDF, charMergeDF, id[0]);
//           saveReviews(reviewsDF, photosDF, id[0]);
//         });

//         // Create indexes for each collection
//         // Metadata.collection.createIndex({ product_id: -1 }, { unique: true })
//         // Review.collection.createIndex({ product_id: -1 }, { unique: true })
//         console.log('DONE LOADING');
//       })
//     });
//   });
// });

// Aggregate data for meta schema
// let ratingsAggDF = reviewsDF.groupBy('product_id', 'characteristic_id')
//   .aggregate(group => group.count('id'))
// let recAggDF = reviewsDF.groupBy('product_id', 'recommend')
//   .aggregate(group => group.count('recommend'))
//   .rename('aggregation', 'count')