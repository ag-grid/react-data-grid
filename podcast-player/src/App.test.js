import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app', () => {
  render(<App />);
  const headerElement = screen.getByText(/Podcast Player/i);
  expect(headerElement).toBeInTheDocument();
});

it("default value is shown in the text feed and select", async () => {
  render(<App />);

  const feedUrl = screen.getByLabelText("RSS Feed URL:");
  expect(feedUrl).toBeInTheDocument();
  expect(feedUrl.value).toEqual("https://feeds.simplecast.com/tOjNXec5");

  const select = screen.getByLabelText("Choose a podcast:");
  expect(select).toBeInTheDocument();
  expect(select.options[select.selectedIndex].text).toEqual("WebRush");
});

