import './App.css';
import React, {useState} from 'react';
import {PodcastGrid} from './PodcastGrid';

function App() {

  const [rssFeed, setRssFeed] = useState("https://feeds.simplecast.com/tOjNXec5");
  const [quickFilter, setQuickFilter] = useState("");

  const handleLoadFeedClick = ()=>{
    const inputRssFeed = document.getElementById("rssFeedUrl").value;
    setRssFeed(inputRssFeed);
  }

  const handleFilterChange = (event)=>{
    setQuickFilter(event.target.value);
  }

  return (
    <div className="App">
      <h1>Podcast Player</h1>
      <div>
        <label htmlFor="rssFeedUrl">RSS Feed URL:</label>
        <input type="text" id="rssFeedUrl" name="rssFeedUrl"  style={{width:"50%"}} defaultValue={rssFeed}/>
        <button onClick={handleLoadFeedClick}>Load Feed</button>
      </div>
      <div>
      <label htmlFor="quickfilter">Quick Filter:</label>
        <input type="text" id="quickfilter" name="quickfilter" style={{width:"30%"}} value={quickFilter}
              onChange={handleFilterChange}/>        
      </div>
      <PodcastGrid
        rssfeed = {rssFeed}
        height="500px"
        width="100%"     
        quickFilter = {quickFilter}   
      ></PodcastGrid>
    </div>
  );
}

export default App;
