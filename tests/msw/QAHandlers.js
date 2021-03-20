/* eslint-disable arrow-body-style */
import { rest } from 'msw';

const testQuestions = {
    product_id: 5,
    results: [{
      question_id: 37,
      question_body: 'Why is this product cheaper here than other sites?',
      question_date: '2018-10-18T00:00:00.000Z',
      asker_name: 'williamsmith',
      question_helpfulness: 4,
      reported: false,
      answers: {
        68: {
          id: 68,
          body: 'We are selling it here without any markup from the middleman!',
          date: '2018-08-18T00:00:00.000Z',
          answerer_name: 'Seller',
          helpfulness: 4,
          photos: [],
        },
      },
    }],
}
const testAnswers =
{
  "question": "1",
  "page": 0,
  "count": 5,
  "results": [
    {
      "answer_id": 8,
      "body": "What a great question!",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 8,
      "photos": [],
    }
  ]
  }



const handlers = [
  rest.get('/api/qa/', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(testQuestions),
    );
  }),
  rest.get('/api/qa/answers', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(testAnswers),
    );
  }),
  rest.put('/api/qa/qhelpfulness', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(testQuestions),
    );
  }),
  rest.put('/api/qa/ahelpfulness', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(testAnswers),
    );
  }),

  rest.put('/api/qa/report', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(testQuestions),
    );
  }),

];

export default handlers;
