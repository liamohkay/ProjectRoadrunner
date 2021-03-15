import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  render, waitFor, screen, getByText, toBeInTheDocument, getByRole
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RelatedItems from '../react-client/src/components/related items/RelatedItemsTest.jsx';
import handlers from './msw/handlers.js';
import axios from 'axios';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const fetch = () => {
  return axios.get('/api/products/16060/styles')
  .then((results) => (results.data))
  .catch((err) => (console.log(err)))
}

test('should receive data from a get request and pass it to a component', async () => {
  const styles = await fetch();
  expect(styles[0].name).toEqual('Forest Green & Black');
  const { container, getByText } = render (<RelatedItems styles={styles} />);
})

test('should render a title', async() => {
  const { container, getByText } = render(<RelatedItems />)
  await waitFor(() => {
    expect(getByText('Related Products')).toBeInTheDocument()
  })
})

test('should render category', async() => {
  const styles = await fetch();
  expect(styles[0].category).toEqual('kicks')
})

test('should render name', async() => {
  const styles = await fetch();
  expect(styles[0].name).toEqual('Forest Green & Black')
})

test('should render price', async() => {
  const styles = await fetch();
  expect(styles[0].original_price).toEqual(140)
})

test('should render a Compare button', async () => {
  const { container, getByRole } = render(<RelatedItems />)
  await waitFor(() => {
    expect(getByRole('button')).toBeInTheDocument()
  })
})