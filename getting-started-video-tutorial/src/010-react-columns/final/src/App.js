import './App.css';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {useState, useEffect, useMemo, useRef, useCallback} from 'react';

function App() {

  const [rowData, setRowData] = useState();
  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
        { 
          headerName: 'Competitor',
          tooltipField: 'country',
          valueGetter: p => p.data.athlete,
          valueFormatter: p => '[' + p.value + ']',
          pinned: 'left'
        },
        { 
          field: 'age',
          width: 100,
          minWidth: 80,
          maxWidth: 200,
          tooltipValueGetter: p => Math.random()
        },        
        { 
          headerName: 'Medals',
          marryChildren: true,
          children: [
            { field: 'total', columnGroupShow: 'closed' },
            { field: 'gold', columnGroupShow: 'open' },
            { field: 'silver', columnGroupShow: 'open'  },
            { field: 'bronze', columnGroupShow: 'open'  },
          ]
        },
        { field: 'country' },
        { field: 'year' },
        { field: 'date' },
        { field: 'sport' }
  ]);

  const onPushMe = useCallback( ()=> {
    const allColumns = 
          gridRef.current.columnApi.getAllColumns();
    const displayedColumns = 
          gridRef.current.columnApi.getAllDisplayedColumns();
    const yearCol = 
          gridRef.current.columnApi.getColumn('year');

    gridRef.current.columnApi.setColumnPinned(yearCol, 'left');

    console.log('Year Column', yearCol);
    console.log('All Columns', allColumns);
    console.log('Displayed Columns', displayedColumns);
  }, []);

  const defaultColDef = useMemo( ()=> ({
    resizable: true,
    editable: true,
    sortable: true
  }), []);

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(result => result.json())
    .then(rowData => setRowData(rowData))
  }, []);

  return (
    <div className="ag-theme-alpine" style={{height: '100%'}}>
      <button onClick={onPushMe}>Push Me</button>
     <AgGridReact
          ref={gridRef}
          defaultColDef={defaultColDef}
          rowData={rowData} 
          columnDefs={columnDefs}
          animateRows={true} 
          />
    </div>
  );
}

export default App;
