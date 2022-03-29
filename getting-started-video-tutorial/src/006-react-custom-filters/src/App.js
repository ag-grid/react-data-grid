import './App.css';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {useState, useRef, useEffect, useMemo, useCallback} from 'react';

import MyFilter from './YearFilter';

function App() {

  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
        { field: 'athlete' },
        { field: 'year', 
              filter: MyFilter,
              filterParams: {
                title: 'Year Filter',
                values: [2000,2004,2006]
              },
              floatingFilter: true
          },
        { field: 'age', 
              filter: MyFilter,
              filterParams: {
                title: 'Age Filter',
                values: [18,19,20,21]
              },
              floatingFilter: true
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

  const filterState = useRef();

  const onBtSave = useCallback( ()=> {
    filterState.current = gridRef.current.api.getFilterModel();
    console.log('saving', filterState.current);    
  });
  const onBtRestore = useCallback( ()=> {
    console.log('restoring', filterState.current);
    gridRef.current.api.setFilterModel(filterState.current);  
  });

  return (
    <div style={{height: '100%'}}>
      <div>
        <button onClick={onBtSave}>Save</button>
        <button onClick={onBtRestore}>Restore</button>
      </div>
      <div className="ag-theme-alpine" style={{height: '100%'}}>
        <AgGridReact ref={gridRef}
            rowData={rowData} animateRows={true} 
            columnDefs={columnDefs}
            />
      </div>
    </div>
  );
}

export default App;
