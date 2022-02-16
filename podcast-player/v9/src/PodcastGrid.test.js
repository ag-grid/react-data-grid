import React from "react";
import {render, waitFor} from '@testing-library/react'

import {PodcastGrid} from './PodcastGrid';
import * as AgGridTest from "./AgGridTestUtils"


// Podcast Grid Locators

const AudioLocator = {
  source: "audio source"
}

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
  
    render(<PodcastGrid 
      rssfeed="https://fakefeed"
      height="500px"
      width="100%"     
      quickFilter=""/>);


    await AgGridTest.waitForGridToBeInTheDOM();
    await AgGridTest.waitForDataToHaveLoaded();

    await AgGridTest.waitForPagination().
    then((pagination)=>{
      expect(pagination.firstRow).toEqual("1");
      expect(pagination.lastRow).toEqual("1");
      expect(pagination.rowCount).toEqual("1");  
    });
    
    // the audio component may take a little extra time to render so waitFor it
    await waitFor(() => {
       expect( AgGridTest.getFirstRowWithNamedCellValue("title", "Fake Episode").
                querySelector(AgGridTest.columnNamed('mp3')).
                  querySelector(AudioLocator.source).
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

    jest.spyOn(window, "fetch").mockImplementation(() =>{
      return Promise.resolve({
        text: () => rssFeedForFiltering
      })}
    );
  
    render(<PodcastGrid 
      rssfeed="https://fakefeed"
      height="500px"
      width="100%"     
      quickFilter="Filtered"/>); 


    await AgGridTest.waitForGridToBeInTheDOM();
    await AgGridTest.waitForDataToHaveLoaded();

    await AgGridTest.waitForPagination().
    then((pagination)=>{
      expect(pagination.firstRow).toEqual("1");
      expect(pagination.lastRow).toEqual("1");
      expect(pagination.rowCount).toEqual("1");  
    });

    // the audio component may take a little extra time to render
    await waitFor(() => {
        expect(AgGridTest.getFirstRowWithNamedCellValue("title", "Filtered Episode").
                querySelector(AgGridTest.columnNamed('mp3')).
                querySelector(AudioLocator.source).
                    getAttribute("src")).
                      toEqual("https://eviltester.com/filtered")
      }
    )

    // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
  }); 


  it("without filter it displays all rows", async () => {

    jest.spyOn(window, "fetch").mockImplementation(() =>{
      return Promise.resolve({
        text: () => rssFeedForFiltering
      })}
    );
  
    render(<PodcastGrid 
      rssfeed="https://fakefeed"
      height="500px"
      width="100%"     
      quickFilter=""/>); 

    await AgGridTest.waitForGridToBeInTheDOM();
    await AgGridTest.waitForDataToHaveLoaded();

    // expect two rows to be displayed
    await AgGridTest.waitForPagination().
    then((pagination)=>{
      expect(pagination.firstRow).toEqual("1");
      expect(pagination.lastRow).toEqual("2");
      expect(pagination.rowCount).toEqual("2");  
    });

    expect(AgGridTest.getNamedCellsWithValues("title", "Fake Episode").length).toEqual(1);
    expect(AgGridTest.getNamedCellsWithValues("title", "Filtered Episode").length).toEqual(1);


  // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
  }); 