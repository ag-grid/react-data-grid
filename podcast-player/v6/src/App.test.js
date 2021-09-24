import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app', () => {
  render(<App />);
  const headerElement = screen.getByText(/Podcast Player/i);
  expect(headerElement).toBeInTheDocument();
});
