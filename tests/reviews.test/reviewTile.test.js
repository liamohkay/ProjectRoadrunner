import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  render, getByPlaceholderText, waitFor, screen, getByText, getByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import handlers from '../msw/handlers.js';
import ReviewTile from '../../react-client/src/components/Reviews/ReviewTile.jsx';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockGetReviews = jest.fn();

test('it should render a review after interacting with an api', async () => {
  const metadata = await axios.get('/api/reviews/meta').then(data => data.data);
  const review = await axios.get('/api/reviews'). then(data => data.data[0]);
  const avgRating = 3.75;

  render(<ReviewTile searchQuery="fo" metadata={metadata} review={review} avgRating={avgRating} getReviews={mockGetReviews} />);
  expect(screen.getByText(/comfortable and practical/i)).toBeInTheDocument();
  expect(screen.getByText(/wearing these shades/i)).toBeInTheDocument();
  expect(screen.getByText(/shortandsweeet/i)).toBeInTheDocument();
});
