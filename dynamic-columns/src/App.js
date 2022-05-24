import './App.css';
import {DynamicColsGrid} from './dynamicColsGrid.js'
import {SimpleDynamicColsGrid} from './simpleDynamicColsGrid.js'


function App() {
  return (
    <div>
      <h2>Swapi.dev requires a more complicated fetch</h2>
      <DynamicColsGrid />
      <h2>Simple fetch with no processing</h2>
      <SimpleDynamicColsGrid />
      <p><a href="https://github.com/ag-grid/react-data-grid/tree/main/dynamic-columns">code here</a></p>
    </div>
  );
}

export default App;
