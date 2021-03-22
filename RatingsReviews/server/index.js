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
  .use(express.static(path.join(__dirname, '../../../react-client/dist/')))

/* -------
API Routes
------- */
app.use('/api/reviews', controllers.getReview)

app.listen(port, () => console.log(`Listening on port: ${port}`));
