import React, {useState} from 'react';
import {AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


export function DynamicColsGrid() {

    // set to default data
    const [rowData, setRowData] = useState();
    const [colDefs, setColDefs] = useState([]);

    const url = 'https://swapi.dev/api/people/';

    // load the data after the grid has been setup
    //[] means on first render so no need to memo the results at this point
    React.useEffect(() => {
        fetch(url,{ 
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
            .then(result => result.json())
            .then(data =>{
                var results 
                const keys = Object.keys(data.results[0])

                let jsonColDefs = keys.map(key =>{ return {field : key};});
                setColDefs(jsonColDefs)
                setRowData(data.results)
            } )
    }, []);

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

