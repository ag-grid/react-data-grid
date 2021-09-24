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


    await waitFor(() => {
      expect(document.querySelector(".ag-cell-value").textContent).toContain("Fake Episode");
    });

    // get pagination and check counts - there can be only 1 (because that's all we mocked)
    const paginationPanel = document.querySelector(".ag-paging-panel");
    const panelId = paginationPanel.getAttribute("id");
    expect(document.querySelector(`#${panelId}-first-row`).textContent).toContain("1");
    expect(document.querySelector(`#${panelId}-last-row`).textContent).toContain("1");
    expect(document.querySelector(`#${panelId}-row-count`).textContent).toContain("1");
    
    const getRowCellNamed = (rowId, cellName)=>{
      console.log(`.ag-row[row-id="${rowId}"] .ag-cell[col-id="${cellName}"]`); // .ag-cell-value
      return document.querySelector(`.ag-row[row-id="${rowId}"] .ag-cell[col-id="${cellName}"]`); // .ag-cell-value
    }

    const getCellValue = (cell)=>{
      return cell.querySelector(".ag-cell-value");
    }

    expect(getCellValue(getRowCellNamed("0","title")).textContent).toEqual("Fake Episode");
    // the audio component may take a little extra time to render
    await waitFor(() => {
        expect(getRowCellNamed("0","mp3").
                querySelector("audio source").
                    getAttribute("src")).
                      toEqual("https://eviltester.com")
      }
    )

    // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
  });
