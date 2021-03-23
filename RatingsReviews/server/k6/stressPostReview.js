import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1s', target: 1000 },
    { duration: '30s', target: 1000 }
  ]
};

/* ----------------------------------------------------------
Testing post API call to /api/reivews with static sample data
---------------------------------------------------------- */
let json = '{"review_id":8616,"product_id":"1500","rating":5,"date":"2019-03-19","summary":"Et et fugit nisi recusandae earum omnis.","body":"Aut accusantium qui et rerum rerum facere dignissimos quia. Eos vero aperiam. Veritatis aut beatae consectetur hic est assumenda dicta sit.","recommend":true,"reported":false,"reviewer_name":"Rusty86","reviewer_email":"Favian.Zieme24@yahoo.com","response":"null","helpfulness":18,"photos":[]}'
var params = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export default function () {
  http.post('http://localhost:3000/api/reviews/', json, params);
  sleep(1);
};