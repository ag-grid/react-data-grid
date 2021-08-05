import {React, useState} from 'react';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

export function CarsGrid() {

    const [rowData, setRowData] = useState([
        {make: "Toyota", model: "Celica", price: 35000},
        {make: "Ford", model: "Mondeo", price: 32000},
        {make: "Porsche", model: "Boxter", price: 72000}
    ]);

    const [haveLoadedData, setHaveLoadedData] = useState(false);
    
    const loadData = ()=>{
        fetch('https://www.ag-grid.com/example-assets/row-data.json')
           .then(result => result.json())
           .then(rowData => setRowData(rowData))
           .then(setHaveLoadedData(true))
    }

   return (
       <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
           { !haveLoadedData &&        
                <button onClick={loadData}>Load Data</button>
           }
           <AgGridReact
                defaultColDef={{sortable: true, filter: true }}
                pagination={true}
               rowData={rowData}>
               <AgGridColumn field="make"></AgGridColumn>
               <AgGridColumn field="model"></AgGridColumn>
               <AgGridColumn field="price" editable={true}></AgGridColumn>
           </AgGridReact>
       </div>
   );
};

