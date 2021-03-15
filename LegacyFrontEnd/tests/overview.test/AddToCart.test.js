import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  render, getByPlaceholderText, waitFor, screen, getByText, getByRole, getByLabelText, getByTestId, fireEvent
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import handlers from '../msw/handlers.js';
import AddToCart from '../../react-client/src/components/product-overview/AddToCart.jsx';
import TestAddToCart from './TestAddToCart.jsx';
import selectEvent from 'react-select-event'


const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// AddToCart props -
// product (object),
// selectedStyle (style id num),
// styleOptions (array of styles, each has an associated 'skus' object)

const productWithoutStock = [{
  id: 1,
  style_id: 1,
  name: 'Forest Green & Black',
  original_price: 140,
  sale_price: 0,
  default: true,
  skus: {}
}]

const productWithStock = [{
  id: 1,
  style_id: 1,
  name: 'Forest Green & Black',
  skus: {
    222: {
      quantity: 12,
      size: 2
    },
    333: {
      quantity: 3,
      size: 3
    }
  },
}]

describe('add to cart module', () => {
  describe('dropdown behavior', () => {
    test('if there is no stock, the size dropdown should be disabled', async () => {

      const { getByRole } = render(<TestAddToCart outOfStock={true} />);

      expect(getByRole("form").children[1].children[1].children[0].children[1]).toBeDisabled();

    });
    test('if there is no size selected, the qty dropdown should be disabled', async () => {

      const { getByRole } = render(<TestAddToCart selectedSize={''} />);
      expect(getByRole("form").children[3].children[1].children[0].children[1].children[0].children[0]).toBeDisabled();

    });
  });
  describe('the add to cart button', () => {
    test('should be hidden if there is no stock', async () => {

      render(<AddToCart product={productWithoutStock[0]} styleOptions={productWithoutStock} selectedStyle={1} />);
      expect(screen.queryByText("ADD TO BAG")).not.toBeInTheDocument()

    });
    test('on click, if no size is selected, a message should appear', async () => {

      render(<TestAddToCart product={productWithStock} selectedSize={''} />);
      userEvent.click(screen.getByText('ADD TO BAG'));
      await waitFor(()=> expect(screen.getByText('PLEASE SELECT SIZE')).toBeInTheDocument);

    });
    test('on click, if a valid size and qty are selected, a post request should be sent to the cart API and an alert should appear', async () => {

      const mockAlert = jest.spyOn(window, 'alert');
      render(<TestAddToCart product={productWithStock} selectedSize={'S'} selectedQty={2} />);
      userEvent.click(screen.getByText('ADD TO BAG'));
      await waitFor(()=> expect(mockAlert).toHaveBeenCalledTimes(1));

    });
  });
});