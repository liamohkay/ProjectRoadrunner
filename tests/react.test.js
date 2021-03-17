import App from '../react-client/src/components/App';
import Overview from '../react-client/src/components/product-overview/Overview.jsx';
import app from '../server';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';

test('renders a message', () => {
  const { container, getByText } = render(<Overview product={{id: 16060}}/>)
  expect(getByText('Heir')).toBeInTheDocument();
})