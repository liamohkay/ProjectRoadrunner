import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  render, fireEvent, waitFor, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../react-client/src/components/App';
import handlers from './msw/handlers.js';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('it works', () => {
  const { container, getByText } = render(<App/>)
  expect(getByText('Air')).toBeInTheDocument();
})