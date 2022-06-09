import './App.css';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import 'ag-grid-enterprise';

import {useState, useRef, useEffect, useMemo} from 'react';

function App() {

  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
        { field: 'athlete' },
        { field: 'age' },
        { field: 'country' },
        { field: 'year' },
        { field: 'date' },
        { field: 'sport' },
        { field: 'gold' },
        { field: 'silver' },
        { field: 'bronze' },
        { field: 'total' }
  ]);
  const defaultColDef = useMemo( ()=> ( {
    resizable: true, 
    enableRowGroup: true
  }), []);

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(result => result.json())
    .then(rowData => setRowData(rowData))
  }, []);

  return (
    <div className="ag-theme-alpine" style={{height: '100%'}}>
      <AgGridReact 
      ref={gridRef}
          rowData={rowData} 
          animateRows={true} 
          columnDefs={columnDefs} defaultColDef={defaultColDef}   
          rowGroupPanelShow='always'
          suppressDragLeaveHidesColumns= {true}
          suppressMakeColumnVisibleAfterUnGroup= {true}
          sideBar= {true}  
          />
          {/* additional properties shown in the video */}
          {/* rowGroupPanelShow is always|onlyWhenGrouping|never */}
          {/* groupDisplayType= 'singleColumn' */}
          {/* groupDisplayType= 'multipleColumns' */}
          {/* groupDisplayType= 'groupRows' */}
          {/* groupDisplayType= 'custom' */}
          {/* groupHideOpenParents= {true} */}
          {/* showOpenedGroup= {true} */}
          {/* groupRowRenderer= 'agGroupCellRenderer' */}   
    </div>
  );
}

export default App;
