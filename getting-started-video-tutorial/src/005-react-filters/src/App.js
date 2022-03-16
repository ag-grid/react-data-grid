import './App.css';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import 'ag-grid-enterprise';
import {useState, useRef, useEffect, useMemo, useCallback} from 'react';

function App() {

  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
        { field: 'athlete', filter: 'agTextColumnFilter' },
        { field: 'age',  filter: 'agNumberColumnFilter' },
        { field: 'year', filter: 'agSetColumnFilter' },
        { field: 'country', filter: 'agMultiColumnFilter' },
        { field: 'date',  filter: 'agDateColumnFilter' }
  ]); 
  const defaultColDef = useMemo( ()=> ( {
    floatingFilter: true,
    flex: 1,
    // filterParams: {
    //   buttons: ['apply','clear']
    // }
  }), []);

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(result => result.json())
    .then(rowData => setRowData(rowData))
  }, []);

  const savedFilterState = useRef();

  const onBtSave = useCallback( ()=> {
    const filterModel = gridRef.current.api.getFilterModel();
    console.log('Saving Filter Model', filterModel);
    savedFilterState.current = filterModel;
  }, []);

  const onBtApply = useCallback( ()=> {
    const filterModel = savedFilterState.current;
    console.log('Applying Filter Model', filterModel);
    gridRef.current.api.setFilterModel(filterModel);
  }, []);

  return (
    <div style={{height: '100%'}}>
      <div>
        <button onClick={onBtSave}>Save</button>
        <button onClick={onBtApply}>Apply</button>
      </div>
      <div className="ag-theme-alpine" style={{height: '100%'}}>
        <AgGridReact ref={gridRef}
            rowData={rowData} animateRows={true} 
            columnDefs={columnDefs} defaultColDef={defaultColDef}          
            />
      </div>
    </div>
  );
}

export default App;
