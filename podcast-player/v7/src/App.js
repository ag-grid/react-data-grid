import './App.css';
import React, {useState} from 'react';
import {PodcastGrid} from './PodcastGrid';

function App() {

  const [inputFeedUrl, setInputFeedUrl] = useState("https://feeds.simplecast.com/tOjNXec5");
  const [rssFeed, setRssFeed] = useState("");
  const [quickFilter, setQuickFilter] = useState("");
  const [feedUrls, setFeedUrls] = useState(
            [
              {name: "WebRush", url:"https://feeds.simplecast.com/tOjNXec5"},
              {name: "The Evil Tester Show", url:"https://feed.pod.co/the-evil-tester-show"},
              {name: "The Change log", url:"https://changelog.com/podcast/feed"},
              {name: "JS Party", url: "https://changelog.com/jsparty/feed"},
              {name: "Founders Talk", url:"https://changelog.com/founderstalk/feed"},
            ]
  );

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
        <label htmlFor="podcasts">Choose a podcast:</label>
        <select name="podcasts" id="podcasts" value={inputFeedUrl}
              onChange={(event)=>setInputFeedUrl(event.target.value)}>
              {feedUrls.map((feed) =>
                <option value={feed.url} key={feed.url}
                >{feed.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="rssFeedUrl">RSS Feed URL:</label>
        <input type="text" id="rssFeedUrl" name="rssFeedUrl"  style={{width:"50%"}} 
                value={inputFeedUrl}
                onChange={(event)=>setInputFeedUrl(event.target.value)}/>
        <button onClick={handleLoadFeedClick}>Load Feed</button>
      </div>
      <div>
      <label htmlFor="quickfilter">Quick Filter:</label>
        <input type="text" id="quickfilter" name="quickfilter" style={{width:"30%"}} value={quickFilter}
              onChange={handleFilterChange}/>        
      </div>
      <div>
        <PodcastGrid rssfeed = {rssFeed}
                     height="500px" width="100%"     
                     quickFilter = {quickFilter}   
      ></PodcastGrid>
      </div>
    </div>
  );
}

export default App;
