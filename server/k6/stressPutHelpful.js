import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '5s', target: 1000 },
    { duration: '30s', target: 1000 }
  ]
};

// Helper function to generate random product_id
const getRandID = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/* -------------------------------------------------------------------------------------
Testing API call to /api/reivews/:review_id/helpful on random indexes for entire dataset
------------------------------------------------------------------------------------- */
let reviewID = 1;

export default function () {
  http.put(`http://localhost:3000/api/reviews/${reviewID}/helpful`);
  reviewID = getRandID(1, 5777923);
  sleep(1);
};