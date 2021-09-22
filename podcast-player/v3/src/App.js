import './App.css';
import {PodcastGrid} from './PodcastGrid';

function App() {
  return (
    <div className="App">
      <h1>Podcast Player</h1>
      <PodcastGrid
        rssfeed = "https://feeds.simplecast.com/tOjNXec5"
        height="500px"
        width="100%"
      ></PodcastGrid>
    </div>
  );
}

export default App;
