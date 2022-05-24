import React, {useState} from 'react';
import {AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


export function SimpleDynamicColsGrid() {

    // set to default data
    const [rowData, setRowData] = useState();
    const [colDefs, setColDefs] = useState([]);

    const url = 'https://hp-api.herokuapp.com/api/characters';
    //const url = 'https://www.ag-grid.com/example-assets/row-data.json';

    // this is a simple fetch that returns a set of results in json array
    React.useEffect(() => {
        fetch(url)
            .then(result => result.json())
            .then(data =>{
                const keys = Object.keys(data[0])
                let jsonColDefs = keys.map(key =>{ return {field : key};});
                setColDefs(jsonColDefs)
                setRowData(data)
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

