const port = 3000;
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('./controllers.js');

const app = express()
  .use(cors())
  .use(morgan('dev'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))

/* -------
API Routes
------- */
app.get('/api/reviews', controllers.getReview);
app.get('/api/reviews/meta', controllers.getMeta);
app.post('/api/reviews', controllers.postReview);
app.put('/api/reviews/:review_id/helpful', controllers.putHelpful);
app.put('/api/reviews/:review_id/report', controllers.putReport);
app.get('loaderio-0948ca3d8f40c75f67d90a6830f7b2fd', controllers.getLoaderIO);

app.listen(port, () => console.log(`Listening on port: ${port}`));
