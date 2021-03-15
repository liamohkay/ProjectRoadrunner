const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const reviewsController = require('./reviews/controller.js');
const sharedController = require('./shared/controller.js');
const cartController = require('./cart/controller.js');
const questionsController = require('./qa/controller.js');
const interactionsController = require('./interactions/controller.js');



app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api/reviews', reviewsController);
app.use('/api/shared', sharedController);
app.use('/api/cart', cartController);
app.use('/api/qa', questionsController)
app.use('/api/interactions', interactionsController);

app.use(express.static(path.join(__dirname + '/../react-client/dist')));


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = app;