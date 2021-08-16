import './App.css';

// uncomment each to use a different version of the Simple cars grid implementation.
// check ../readme.md to see what each does
//import {CarsGrid} from './carsGridSimplestExampleDefaultData.js'
//import {CarsGrid} from './carsGridSimplestExampleColsAsObjectsMemoized.js'
//import {CarsGrid} from './carsGridSimplestExampleColsAsObjectsState'
import {CarsGrid} from './carsgrid'


function App() {
  return (
    <CarsGrid />
  );
}

export default App;
