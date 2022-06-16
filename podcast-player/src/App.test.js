import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event'
import * as AgGridTest from "./AgGridTestUtils"
import preview from 'jest-preview'

test('renders the app', () => {
  render(<App />);
  const headerElement = screen.getByText(/Podcast Player/i);
  expect(headerElement).toBeInTheDocument();
  preview.debug()
});

it("shows default value text feed url field", async () => {
  render(<App />);

  const feedUrl = screen.getByLabelText("RSS Feed URL:");
  expect(feedUrl).toBeInTheDocument();
  expect(feedUrl.value).toEqual("https://feeds.simplecast.com/tOjNXec5");
  preview.debug();
});

it("shows default value in select", async () => {
  render(<App />);

  const select = screen.getByLabelText("Choose a podcast:");
  expect(select).toBeInTheDocument();
  expect(select.options[select.selectedIndex].text).toEqual("WebRush");
  preview.debug();
});


// using user event https://testing-library.com/docs/ecosystem-user-event
it("changes url in feed when select chosen", async () => {
  render(<App />);

  userEvent.selectOptions(screen.getByLabelText("Choose a podcast:"),'The Evil Tester Show');

  const displayedFeedUrl = screen.getByLabelText("RSS Feed URL:");
  expect(displayedFeedUrl.value).toEqual("https://feed.pod.co/the-evil-tester-show");
  preview.debug();
});

it("has no selected option when url in feed does not match a select because the first will be shown", async () => {
  render(<App />);

  const select = screen.getByLabelText("Choose a podcast:");
  userEvent.selectOptions(select,'The Evil Tester Show');

  const displayedFeedUrl = screen.getByLabelText("RSS Feed URL:");
  expect(displayedFeedUrl.value).toEqual("https://feed.pod.co/the-evil-tester-show");

  expect(select.options[select.selectedIndex].text).toEqual("The Evil Tester Show");
  userEvent.type(displayedFeedUrl, 'Hello')
  expect(select.options[select.selectedIndex].text).toEqual("WebRush");
  expect(displayedFeedUrl.value).toContain("Hello");
  preview.debug();
});

const fakeEvilFeed = 
`<channel>
    <item>
        <title>Fake Evil Tester Episode</title>
        <pubDate>Thu, 23 Sep 2021 10:00:00 +0000</pubDate>
        <enclosure url="https://eviltester.com"/>
        <description>
        <![CDATA[ <p>Fake Evil Tester Description</p> ]]>
        </description>
    </item>
</channel>`;

const fakeWebrushFeed = 
`<channel>
    <item>
        <title>Fake WebRush Episode</title>
        <pubDate>Thu, 27 Sep 2021 10:00:00 +0000</pubDate>
        <enclosure url="https://webrush.io"/>
        <description>
        <![CDATA[ <p>Fake WebRush Description</p> ]]>
        </description>
    </item>
</channel>`;

// when button clicked the feed is loaded into the grid
it("loads feed into grid when button pressed", async () => {

  jest.spyOn(window, "fetch").mockImplementation((aUrl) =>{

    if(aUrl==="https://feed.pod.co/the-evil-tester-show"){
      return Promise.resolve({text: () => fakeEvilFeed});
    }else{
      return Promise.resolve({text: () => fakeWebrushFeed});
    }
  });


  render(<App />);

  userEvent.selectOptions(screen.getByLabelText("Choose a podcast:"),'The Evil Tester Show');

  const loadButton = screen.getByText("Load Feed");
  userEvent.click(loadButton);

  await AgGridTest.waitForGridToBeInTheDOM();
  await AgGridTest.waitForDataToHaveLoaded();

  // wait for first cell to expected data
  await waitFor(() => {
    expect(AgGridTest.getNamedCellsWithValues("title", "Fake Evil Tester Episode").length).toEqual(1);
  });


  // remove the mock to ensure tests are completely isolated
  global.fetch.mockRestore();
  preview.debug();
});