const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const queries = require('../db/dbQueries.js');
const port = 3000;

const app = express()
  .use(cors())
  .use(morgan('dev'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, '../../../react-client/dist/')))

/* -------
API Routes
------- */
app.use('/api/reviews', queries.getReview);

app.listen(port, () => console.log(`Listening on port: ${port}`));
