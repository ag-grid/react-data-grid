import './App.css';
import React, {useState} from 'react';
import {PodcastGrid} from './PodcastGrid';

function App() {

  const [rssFeed, setRssFeed] = useState("https://feeds.simplecast.com/tOjNXec5");

  const handleLoadFeedClick = ()=>{
    const inputRssFeed = document.getElementById("rssFeedUrl").value;
    setRssFeed(inputRssFeed);
  }

  return (
    <div className="App">
      <h1>Podcast Player</h1>
      <div>
        <label htmlFor="rssFeedUrl">RSS Feed URL:</label>
        <input type="text" id="rssFeedUrl" name="rssFeedUrl" style={{width:"50%"}} defaultValue={rssFeed}/>
        <button onClick={handleLoadFeedClick}>Load Feed</button>
      </div>
      <PodcastGrid
        rssfeed = {rssFeed}
        height="500px"
      ></PodcastGrid>
    </div>
  );
}

export default App;
