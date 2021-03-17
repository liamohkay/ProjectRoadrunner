import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  render, getByPlaceholderText, waitFor, screen, getByText, getByRole
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import handlers from '../msw/QAHandlers.js';
import QuestionTest from '../../react-client/src/components/Questions-Answers/QATests/QuestionTest.jsx';
import AnswerTest from '../../react-client/src/components/Questions-Answers/QATests/AnswerTest.jsx';
import AnswerModalsTest from '../../react-client/src/components/Questions-Answers/QATests/AnswerModalsTest.jsx';

const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockGetQuestions = jest.fn();
test('it should render a Question after interacting with an api', async () => {
  const { getByText } = render(<QuestionTest currentProduct={{id: 5}} />)
  await waitFor(() => {
    expect(getByText('Why is this product cheaper here than other sites?')).toBeInTheDocument();
  });
});

test('it should render helpfulness to the page', async () => {
  const { getByText } = await render(<QuestionTest currentProduct={{id: 5}} />)
  await waitFor(() => {
    expect(getByText(/4/i)).toBeInTheDocument();
    expect(getByText(/helpful/i)).toBeInTheDocument();
  })
});

test('it should change report to reported after interacting clicking on report', async () => {
  const { getByText } = await render(<QuestionTest currentProduct={{id: 5}} />)
  await waitFor(() => {
    expect(getByText('Report')).toBeInTheDocument();
  });
  const report = screen.getByText("Report");
  userEvent.click(report)
  await waitFor(() => {
    expect(getByText('Reported')).toBeInTheDocument();
  });
});


const mockGetAnswers = jest.fn()
test('it should render an Answer after interacting with an api', async () => {

  const { getByText } = render(<AnswerTest id={{question: 1}} product={{id: 5}} />)
  await waitFor(() => {
    expect(getByText('What a great question!')).toBeInTheDocument();
  });
});
test('it should change report to reported after interacting clicking on report', async () => {
  const { getByText } = await render(<AnswerTest currentProduct={{id: 5}} />)
  await waitFor(() => {
    expect(getByText('Report')).toBeInTheDocument();
  });
  const report = screen.getByText("Report");
  userEvent.click(report)
  await waitFor(() => {
    expect(getByText('Reported')).toBeInTheDocument();
  });
});
test('it should render answer name and date to the page', async () => {
  const questions = await axios.get('/api/qa/').then(data => data.data)
  const { getByText } = await render(<AnswerTest id={questions.question_id} questionInfo={questions} currentProduct={{id: 5}} />)

  await waitFor(() => {
    expect(getByText(/metslover/i)).toBeInTheDocument();
    expect(getByText(/Jan 03 2018/i)).toBeInTheDocument();
    expect(getByText(/Helpful/i)).toBeInTheDocument();
  })
});

const mockAnswerModal = jest.fn()
test('it should render an Add Answer button', async () => {
  const question = await axios.get('/api/qa/').then(data => data.data)
  const { getByText } = render(<AnswerModalsTest question={question} product={{id:5}} />)

  await waitFor(() => {
    expect(getByText('Add Answer')).toBeInTheDocument();
});
})
test('When Add Answer is clicked, Modal should pop up', async () => {
  const question = await axios.get('/api/qa/').then(data => data.data)
  const { getByText } = render(<AnswerModalsTest question={question} product={{id:5}} />)

  const addAnswer = screen.getByText("Add Answer");
  userEvent.click(addAnswer)

  await waitFor(() => {
    expect(getByText('Your Email')).toBeInTheDocument();
    expect(getByText('For privacy reasons, do not use your full name or email address')).toBeInTheDocument();
    expect(getByText('For authentication reasons, you will not be emailed')).toBeInTheDocument();
    expect(getByText('What is your nickname?')).toBeInTheDocument();
})
})