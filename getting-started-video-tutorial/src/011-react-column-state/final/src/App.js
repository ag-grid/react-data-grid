import './App.css';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {useState, useRef, useEffect, useMemo, useCallback} from 'react';

import 'ag-grid-enterprise';

// 1.	Column Definitions
// 2.	Column State API
// 3.	Specific Column API’s

function App() {

  const gridRef = useRef();
  const [rowData, setRowData] = useState();

  const [includeMedals, setIncludeMedals] = useState(true);
  const [capHeaders, setCapHeaders] = useState(false);
  const [agePinned, setAgePinned] = useState(undefined);

  const savedColState = useRef();

  const columnDefs = useMemo( ()=> {
      return [
          { 
            field: 'athlete',
            headerName: capHeaders ? 'ATHLETE' : 'Athlete' 
          }, 
          { 
            field: 'age',
            pinned: agePinned,
            headerName: capHeaders ? 'AGE' : 'Age'
          },
          { field: 'country' }, 
          { field: 'gold', hide: !includeMedals }, 
          { field: 'silver', hide: !includeMedals },
          { field: 'bronze', hide: !includeMedals }, 
          { field: 'total', hide: !includeMedals }
      ];
    }, [includeMedals, capHeaders, agePinned]);

  const onGroupViaApi = useCallback( ()=> {
    gridRef.current.columnApi.setRowGroupColumns(
                            ['country','athlete']);
    gridRef.current.columnApi.setColumnsVisible(
                            ['country','athlete'], false);
    gridRef.current.columnApi.setValueColumns(
                            ['silver','bronze','gold','total']);
    gridRef.current.columnApi.setColumnAggFunc(
                            'silver','sum');
    gridRef.current.columnApi.setColumnAggFunc(
                            'bronze','sum');
    gridRef.current.columnApi.setColumnAggFunc(
                            'gold','sum');
    gridRef.current.columnApi.setColumnAggFunc(
                            'total','sum');
  }, []);

  const onGrouping = useCallback( ()=> {
    gridRef.current.columnApi.applyColumnState(
      {
        state: [
          { colId: 'athlete', rowGroupIndex: 1, hide: true }, 
          { colId: 'country', rowGroupIndex: 0, hide: true }, 
          { colId: 'gold', aggFunc: 'sum'},
          { colId: 'silver', aggFunc: 'sum'},
          { colId: 'bronze', aggFunc: 'sum'},
          { colId: 'total', aggFunc: 'sum'},
        ],
        applyOrder: true
      }
    );
  }, []);

  const onColsMedalsFirst = useCallback( ()=> {
    gridRef.current.columnApi.applyColumnState(
      {
        state: [
          { colId: 'gold' }, { colId: 'silver' },
          { colId: 'bronze' }, { colId: 'total' },
          { colId: 'athlete' }, { colId: 'age' },
          { colId: 'country' }
        ],
        applyOrder: true
      }
    );
  });

  const onColsMedalsLast = useCallback( ()=> {
    gridRef.current.columnApi.applyColumnState(
      {
        state: [
          { colId: 'athlete' }, { colId: 'age' },
          { colId: 'country' },
          { colId: 'gold' }, { colId: 'silver' },
          { colId: 'bronze' }, { colId: 'total' }
        ],
        applyOrder: true
      }
    );
  });

  const onSortGoldSilver = useCallback( ()=> {
    gridRef.current.columnApi.applyColumnState(
      {
        state: [
          { colId: 'gold', sort: 'desc', sortIndex: 0 },
          { colId: 'silver', sort: 'desc', sortIndex: 1 }
        ],
        defaultState: {
          sort: null
        }
      }
    );
  }, []);

  const onWidth100 = useCallback( ()=> {
    gridRef.current.columnApi.applyColumnState(
      {
        state: [
          { colId: 'athlete', width: 100 }
        ],
        defaultState: {
          width: 200
        }
      }
    );
  }, []);

  const onSaveColState = useCallback( ()=> {
    const colState = 
        gridRef.current.columnApi.getColumnState();
    console.log('Saving Column State', colState);
    savedColState.current = colState;
  }, []);

  const onRestoreColState = useCallback( ()=> {
    console.log('Restoring Column State', 
                      savedColState.current);
    gridRef.current.columnApi.applyColumnState(
                      {state: savedColState.current});
  }, []);
      
  const toggleMedals = useCallback( ()=> {
    setIncludeMedals( prev => !prev );
  }, []);

  const toggleCapHeaders = useCallback( ()=> {
    setCapHeaders( prev => !prev );
  }, []);
    
  const defaultColDef = useMemo( ()=> ({
    resizable: true,
    sortable: true,
    width: 100
  }));

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(result => result.json())
    .then(rowData => setRowData(rowData))
  }, []);

  return (
    <div className="ag-theme-alpine" style={{height: '100%'}}>
      <b>Changing Column Definitions</b>
      <br/>
      <button onClick={toggleMedals}>Toggle Medals</button>
      <button onClick={toggleCapHeaders}>Toggle Headers</button>
      <br/>
      Set Age Pinned:
      <button onClick={()=>setAgePinned('left')}>Left</button>
      <button onClick={()=>setAgePinned('right')}>Right</button>
      <button onClick={()=>setAgePinned(null)}>NULL</button>
      <button onClick={()=>setAgePinned(undefined)}>undefined</button>
      <br/>
      <b>Column State</b>
      <br/>
      <button onClick={onSaveColState}>Save State</button>
      <button onClick={onRestoreColState}>Restore State</button>
      <br/>
      <button onClick={onWidth100}>Width 100</button>
      <button onClick={onSortGoldSilver}>Sort Gold Silver</button>
      <button onClick={onColsMedalsFirst}>Medals First</button>
      <button onClick={onColsMedalsLast}>Medals Last</button>
      <button onClick={onGrouping}>Group Country Athlete</button>
      <br/>
      <b>Column API</b>
      <br/>
      <button onClick={onGroupViaApi}>Group Country Athlete</button>
      <br/>
      <AgGridReact ref={gridRef}
          maintainColumnOrder={true}
          defaultColDef={defaultColDef}
          rowData={rowData} animateRows={true} 
          columnDefs={columnDefs}
          />
    </div>
  );
}

export default App;
