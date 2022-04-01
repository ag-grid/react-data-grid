import './App.css';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {useState, useRef, useEffect, useMemo, useCallback} from 'react';

import ValuesFilter from './valuesFilter';
import ValuesFloatingFilter from './valuesFloatingFilter';

function App() {

  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
        { field: 'athlete' },
        { field: 'year', 
              filter: ValuesFilter,
              filterParams: {
                values: [2000,2004]
              },
              floatingFilter: true,
              floatingFilterComponent: ValuesFloatingFilter
          },
        { field: 'age', 
              filter: ValuesFilter,
              filterParams: {
                values: [18, 19]
              },
              floatingFilter: true,
              floatingFilterComponent: ValuesFloatingFilter
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
    <div className="ag-theme-alpine" style={{height: '100%'}}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs}
          animateRows={true}/>
    </div>
  );
}

export default App;
