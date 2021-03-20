import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  render, getByPlaceholderText, waitFor, screen, getByText, getByRole
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import handlers from '../msw/handlers.js';
import ImageGallery from '../../react-client/src/components/product-overview/ImageGallery.jsx';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


describe('image gallery', () => {
  test('it should fetch photos, render thumbnails, and then respond to user clicks on thumbnails', async () => {

    const mockSelectPhoto = jest.fn();

    const photos = await axios.get('/api/products/16060/styles').then(data => data.data[0].photos);

    render(<ImageGallery photos={photos} selectPhoto={mockSelectPhoto} />);

    const thumbnail = screen.queryByAltText("thumbnail");

    userEvent.click(thumbnail);

    expect(mockSelectPhoto).toHaveBeenCalledTimes(1);

  });
  test('it should render only two arrow buttons when there are less than 7 photos', async () => {

    render(<ImageGallery photos={['1', '2']}/>    );

    const buttons = await screen.findAllByRole("button", {hidden: true});

    await waitFor(() => {
      expect(buttons.length).toBe(2);
    })
  });
  test('it should render two additional arrow buttons when there are 7 or more photos', async () => {

    render(<ImageGallery photos={['1', '2', '3', '4', '5', '6', '7']}/>);

    const buttons = await screen.findAllByRole("button", {hidden: true});

    await waitFor(() => {
      expect(buttons.length).toBe(4);
    })
  });
});

