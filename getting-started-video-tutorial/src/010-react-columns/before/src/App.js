import './App.css';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {useState, useEffect, useMemo, useRef, useCallback} from 'react';

function App() {

  const [rowData, setRowData] = useState();
  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
        { field: 'athlete' },
        { field: 'age' },
        { field: 'country' },
        { field: 'year' }
        { field: 'date' },
        { field: 'sport' },
        { field: 'gold' },
        { field: 'silver' }
        { field: 'bronze' },
        { field: 'total' }
  ]);

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(result => result.json())
    .then(rowData => setRowData(rowData))
  }, []);

  return (
    <div className="ag-theme-alpine" style={{height: '100%'}}>
     <AgGridReact
          rowData={rowData} 
          columnDefs={columnDefs}
          animateRows={true} 
          />
    </div>
  );
}

export default App;