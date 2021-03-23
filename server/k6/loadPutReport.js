import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500']
  },
};

// Helper function to generate random product_id
const getRandID = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/* -------------------------------------------------------------------------------------
Testing API call to /api/reivews/:review_id/report on random indexes for entire dataset
------------------------------------------------------------------------------------- */
let reviewID = 1;

export default function () {
  http.put(`http://localhost:3000/api/reviews/${reviewID}/report`);
  reviewID = getRandID(1, 5777923);
  sleep(1);
};