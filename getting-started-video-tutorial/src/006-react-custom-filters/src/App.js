import './App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';import {AgGridReact} from 'ag-grid-react';
import {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import MyFilter from './MyFilter';

function App() {

  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const [columnDefs] = useState([
    { field: 'athlete' },
    { field: 'year', 
      filter: MyFilter,
      filterParams: {title: 'Bonkers!'}
    },
    { field: 'age', 
      filter: MyFilter,
      filterParams: {title: 'Flippers!'}
    },
    { field: 'country' },
    { field: 'date' },
    { field: 'sport' },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' }
  ]);

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(result => result.json())
    .then(rowData => setRowData(rowData))
  }, []);

  return (
    <div className="ag-theme-quartz" style={{height: '100%'}}>
      <div style={{height: '100%'}}>
        <AgGridReact 
            reactiveCustomComponents
            rowData={rowData} columnDefs={columnDefs}
            ref={gridRef} animateRows={true}             
            />
      </div>
    </div>
  );
}

export default App;
