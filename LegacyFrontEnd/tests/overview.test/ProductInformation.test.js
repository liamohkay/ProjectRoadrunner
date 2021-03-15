import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  render, screen, getByText,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import handlers from '../msw/handlers.js';
import ProductInformation from '../../react-client/src/components/product-overview/ProductInformation.jsx';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


describe('product information', () => {
  test('it should dynamically render info from 2 seperate get requests', async () => {

    const product = await axios.get('/api/shared/products/').then(data => data.data);

    const style = await axios.get('/api/products/16060/styles').then(data => data.data[0]);

    render(<ProductInformation product={product} price={style.original_price} sale={style.sale_price} />);

    expect(screen.getByText(/Air Minis 250/i)).toBeInTheDocument();
    expect(screen.getByText(/140/i)).toBeInTheDocument();
    expect(screen.getByText(/33/i)).toBeInTheDocument();
  });
});

