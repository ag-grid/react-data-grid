import React from "react";
import { unmountComponentAtNode } from "react-dom";
import {render, waitFor, screen, getAllByDisplayValue} from '@testing-library/react'

import {PodcastGrid} from './PodcastGrid';
import { act } from "react-dom/test-utils";


let container = null;
beforeEach(async () => {
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
            <pubDate>Thu, 23 Sep 2021 10:00:00 +0000</pubDate>
            <enclosure url="https://eviltester.com"/>
            <description>
            <![CDATA[ <p>Fake Description</p> ]]>
            </description>
        </item>
    </channel>`;

    jest.spyOn(window, "fetch").mockImplementation(() =>{
      return Promise.resolve({
        text: () => fakeRSSFeed
      })}
    );
  
    await act(async () => {
      render(<PodcastGrid 
        rssfeed="https://fakefeed"
        height="500px"
        width="100%"     
        quickFilter=""/>, container);
    })


    await waitFor(() => {
      expect(screen.querySelector(".ag-cell-value").textContent).toContain("Fake Episode");
    });
    
    // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
  });