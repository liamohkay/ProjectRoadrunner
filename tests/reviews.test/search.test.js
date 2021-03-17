import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  render, getByPlaceholderText, waitFor, screen, getByText, getByRole } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event'
import Search from '../../react-client/src/components/Reviews/Search.jsx';

const mockSetSearchQuery = jest.fn()

test('it should respond to the user typing and update the searchQuery based off of that', async () => {
  const { container, getByText } = render(<Search setSearchQuery={mockSetSearchQuery} />)

  const input = screen.getByPlaceholderText('search..');

  userEvent.type(input, 'GOOD')
  expect(screen.getByDisplayValue(/good/i)).toBeInTheDocument();
  expect(mockSetSearchQuery).toHaveBeenCalledTimes(4);
})