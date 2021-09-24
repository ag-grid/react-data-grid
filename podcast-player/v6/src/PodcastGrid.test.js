import { render, screen } from '@testing-library/react';
import PodcastGrid from './PodcastGrid';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders user data", async () => {
    const fakeRSSFeed = 
    `<channel>
        <item>
            <title>Fake Episode</title>
            <enclosure url="https://eviltester.com"/>
            <description>
            <![CDATA[ <p>Fake Description</p> ]]>
            </description>
        </item>
    </channel>`;

    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(fakeUser)
      })
    );
  
    // Use the asynchronous version of act to apply resolved promises
    await act(async () => {
      render(<PodcastGrid 
            rssfeed = "https://fakefeed"
            height="500px"
            width="100%"     
            quickFilter = "" />, container);
    });
  
    expect(container.querySelector("div.ag-theme-alpine").textContent).toBeVisible();
    expect(container.querySelector("ag-cell-value").textContent).toBe("Fake Episode");
  
    // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
  });