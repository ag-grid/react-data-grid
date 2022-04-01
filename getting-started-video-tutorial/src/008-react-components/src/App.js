import './App.css';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import {HelloComp, GoodbyeComp, GreetJSComp} from './comps';

import 'ag-grid-enterprise';

function App() {

  const components = useMemo( ()=> ({
    aaa: HelloComp,
    bbb: GoodbyeComp
  }), []);

  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
        { 
          field: 'athlete', 
          cellRenderer: HelloComp,
          cellRendererParams: {name: 'Tom'},
          editable: true,
          cellEditor: GoodbyeComp
        },
        { 
          field: 'age', 
          cellRenderer: 'bbb',
          cellRendererParams: {name: 'Mick'},
          filter: 'agNumberColumnFilter',
          filterParams: {name: 'Dick'},
          floatingFilter: true,
          floatingFilterComponent: HelloComp,
          floatingFilterComponentParams: {name: 'George'}
        },
        { 
          field: 'country', 
          headerComponent: GreetJSComp,
          headerComponentParams: {name: 'Harry'}
        },
        { field: 'year' },
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
      <AgGridReact ref={gridRef}

          noRowsOverlayComponent={HelloComp}
          noRowsOverlayComponentParams=
                  {{name: 'Susan No Rows'}}

          loadingOverlayComponent={GoodbyeComp}
          loadingOverlayComponentParams=
                  {{name: 'Rachel Loading'}}

          statusBar={{
            statusPanels: [
              {
                statusPanel: HelloComp,
                statusPanelParams: {name: 'Peter'},
              },
              {
                statusPanel: GoodbyeComp,
                statusPanelParams: {name: 'Paul'},
              }
            ]
          }}

          sideBar={{
            toolPanels: [
              {
                id: '3',
                labelDefault: 'Columns',
                toolPanel: 'agColumnsToolPanel',
              },
              {
                id: '1',
                labelDefault: 'Custom 1',
                toolPanel: HelloComp,
                toolPanelParams: {name: 'Summer'}
              },
              {
                id: '2',
                labelDefault: 'Custom 2',
                toolPanel: GoodbyeComp,
                toolPanelParams: {name: 'Winter'}
              }
            ]
          }}

          components={components}
          rowData={rowData} animateRows={true} 
          columnDefs={columnDefs}
          />
    </div>
  );
}

export default App;
