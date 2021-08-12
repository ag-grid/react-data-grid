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
    const [colDefs, setColDefs] = useState([
        {field: 'make'},
        {field: 'model'},
        {field: 'price', editable: 'true'},
    ]);

    // Uncomment this to see the changing column daa in action
    // useEffect(
    //     ()=> {
    //     const changeColsTimer = setTimeout(() =>{
    //         setColDefs([{field: 'make'},{field: 'model'}])
    //         },3000);
    //     return ()=>clearTimeout(changeColsTimer);
    //         }
    // ,[]);

   return (
       <div className="ag-theme-alpine" style={{height: 400, width: 600}}>   
           <AgGridReact
                defaultColDef={{sortable: true, filter: true }}
                pagination={true}
                rowData={rowData}
                columnDefs={colDefs}>
           </AgGridReact>
       </div>
   )

};

