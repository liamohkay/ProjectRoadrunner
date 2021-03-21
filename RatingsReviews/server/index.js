const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;

const app = express()
  .use(cors())
  .use(morgan('dev'))
  .use(bodyParser.json())
  .use(bodyParser.urlEncoded({ extended: true }))
  .use(expres.static(path.join(__dirname, '../../../react-client/dist/')))
  .listen(port, () => console.log(`Listening on port: ${port}`));

/* -------
API Routes
------- */
