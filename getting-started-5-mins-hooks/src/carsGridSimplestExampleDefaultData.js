import {React, useState, useMemo, useCallback, useEffect} from 'react';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

// Create Singleton entries for the data ad ColumnDefs

const InitialRowData = [
    {make: "Toyota", model: "Celica", price: 35000},
    {make: "Ford", model: "Mondeo", price: 32000},
    {make: "Porsche", model: "Boxter", price: 72000}
];

export function CarsGrid() {

    // set to default data
    const [rowData, setRowData] = useState(InitialRowData);

    // load the data after the grid has been setup
    //[] means on first render so no need to memo the results at this point
    // useEffect(() => {
    //     fetch('https://www.ag-grid.com/example-assets/row-data.json')
    //         .then(result => result.json())
    //         .then(rowData => setRowData(rowData))
    // }, []);
    

   return (
       <div className="ag-theme-alpine" style={{height: 400, width: 600}}>   
           <AgGridReact
                defaultColDef={{sortable: true, filter: true }}
                pagination={true}
                rowData={rowData}
                >
                <AgGridColumn field="make"></AgGridColumn>
                <AgGridColumn field="model"></AgGridColumn>
                <AgGridColumn field="price" editable={true}></AgGridColumn>
           </AgGridReact>
       </div>
   )
};

