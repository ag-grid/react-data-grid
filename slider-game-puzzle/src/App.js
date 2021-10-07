import './App.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


import {GridSliderGame} from './GridSliderGame'


function App() {
  return (
    <div style={{width:"100%", height:"400px"}}>
    <GridSliderGame></GridSliderGame>
    </div>
  );
}

export default App;
