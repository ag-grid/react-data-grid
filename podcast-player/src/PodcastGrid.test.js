import React from "react";
import { unmountComponentAtNode } from "react-dom";
import {render, waitFor, screen, getAllByDisplayValue} from '@testing-library/react'

import {PodcastGrid} from './PodcastGrid';
import { act } from "react-dom/test-utils";
import * as AgGridTest from "./AgGridTestUtils"


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


it("renders user data from a url", async () => {
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


    // wait for grid to be in the DOM
    await waitFor(() => {
      expect(document.querySelector(".ag-root-wrapper")).toBeInTheDocument();
    });

    // wait for first cell to expected data
    await waitFor(() => {
      expect(document.querySelector(".ag-cell-value").textContent).toContain("Fake Episode");
    });

    // get pagination and check counts - there can be only 1 (because that's all we mocked)
    const paginationPanel = document.querySelector(".ag-paging-panel");
    const panelId = paginationPanel.getAttribute("id");
    expect(document.querySelector(`#${panelId}-first-row`).textContent).toContain("1");
    expect(document.querySelector(`#${panelId}-last-row`).textContent).toContain("1");
    expect(document.querySelector(`#${panelId}-row-count`).textContent).toContain("1");
    


    expect(AgGridTest.getCellValue(AgGridTest.getRowCellNamed("0","title")).textContent).toEqual("Fake Episode");

    // the audio component may take a little extra time to render
    await waitFor(() => {
        expect(AgGridTest.getRowCellNamed("0","mp3").
                querySelector("audio source").
                    getAttribute("src")).
                      toEqual("https://eviltester.com")
      }
    )

    // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
  });

  const rssFeedForFiltering = `<channel>
  <item>
      <title>Fake Episode</title>
      <pubDate>Thu, 23 Sep 2021 10:00:00 +0000</pubDate>
      <enclosure url="https://eviltester.com"/>
      <description>
        <![CDATA[ <p>Fake Description</p> ]]>
      </description>
  </item>
  <item>
      <title>Filtered Episode</title>
      <pubDate>Thu, 24 Sep 2021 10:00:00 +0000</pubDate>
      <enclosure url="https://eviltester.com/filtered"/>
      <description>
        <![CDATA[ <p>Filtered Description</p> ]]>
      </description>
  </item>
</channel>`;

  it("applies a quick filter", async () => {
    const fakeRSSFeed = rssFeedForFiltering;

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
        quickFilter="Filtered"/>, container);
    })


    // wait for grid to be in the DOM
    await waitFor(() => {
      expect(document.querySelector(".ag-root-wrapper")).toBeInTheDocument();
    });

    // wait for first cell to expected data
    await waitFor(() => {
      expect(document.querySelector(".ag-cell-value").textContent).toContain("Filtered Episode");
    });

    // get pagination and check counts - there can be only 1 (because that's all we mocked)
    const paginationPanel = document.querySelector(".ag-paging-panel");
    const panelId = paginationPanel.getAttribute("id");
    expect(document.querySelector(`#${panelId}-first-row`).textContent).toContain("1");
    expect(document.querySelector(`#${panelId}-last-row`).textContent).toContain("1");
    expect(document.querySelector(`#${panelId}-row-count`).textContent).toContain("1");
    

    // helper method to find a row id and cell named in that row


    let foundRowId = undefined;
    await waitFor(() => {
        const row = AgGridTest.getRowWithNamedCellValue("title", "Filtered Episode");
        expect(row).toBeDefined();
        foundRowId = row.getAttribute("row-id");
    })

    // the audio component may take a little extra time to render
    await waitFor(() => {
        expect(AgGridTest.getRowCellNamed(foundRowId,"mp3").
                querySelector("audio source").
                    getAttribute("src")).
                      toEqual("https://eviltester.com/filtered")
      }
    )

    // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
  }); 


  it("without filter it displays all rows", async () => {
    const fakeRSSFeed = rssFeedForFiltering;

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


    // wait for grid to be in the DOM
    await waitFor(() => {
      expect(document.querySelector(".ag-root-wrapper")).toBeInTheDocument();
    });

    // wait for first cell to expected data
    await waitFor(() => {
      expect(document.querySelector(".ag-cell-value").textContent).toContain("Fake Episode");
    });

    // get pagination and check counts - there can be only 1 (because that's all we mocked)
    const paginationPanel = document.querySelector(".ag-paging-panel");
    const panelId = paginationPanel.getAttribute("id");
    expect(document.querySelector(`#${panelId}-first-row`).textContent).toContain("1");
    expect(document.querySelector(`#${panelId}-last-row`).textContent).toContain("2");
    expect(document.querySelector(`#${panelId}-row-count`).textContent).toContain("2");
    
    await waitFor(() => {
        const row = AgGridTest.getRowWithNamedCellValue("title", "Filtered Episode");
        expect(row).toBeDefined();
    })

    await waitFor(() => {
      const row = AgGridTest.getRowWithNamedCellValue("title", "Fake Episode");
      expect(row).toBeDefined();
  })

  // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
  }); 