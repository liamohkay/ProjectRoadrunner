import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 1000 }
  ]
};

// Helper function to generate random product_id
const getRandID = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/* -----------------------------------------------------------------------
Testing API call to /api/reivews/meta on random indexes for entire dataset
------------------------------------------------------------------------ */
let productID = 1;

export default function () {
  http.get(`http://localhost:3000/api/reviews/meta/?product_id=${productID}`);
  productID = getRandID(1, 5777923);
  sleep(1);
};