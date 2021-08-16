import React, {useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


import { NumberFormatter } from './NumberFormatter.js';
import {NumericCellEditor} from './NumericCellEditor.js';
import { RangeFilter } from './RangeFilter';

export function CustomGrid() {

    const [rowData, setRowData] = useState([]);


    const [colDefs, setColDefs] = useState(
        [
            {field:"make"},
            {field:"model"},
            {field:"price",
            editable:true,
            cellRenderer: "numberFormatter",
            cellEditor: "numericCellEditor",
            filter: 'rangeFilter'
            }
        ]);


    useEffect(() => {
        fetch('https://www.ag-grid.com/example-assets/row-data.json')
            .then(result => result.json())
            .then(rowData => setRowData(rowData))
    }, []);

    return (
        <div className="ag-theme-alpine"
            style={{height: '400px', width: '600px'}}
        >
            <AgGridReact
                defaultColDef={{sortable: true, filter: true }}
                pagination={true}
                
                frameworkComponents={{
                    numberFormatter: NumberFormatter,
                    numericCellEditor: NumericCellEditor,
                    rangeFilter: RangeFilter
                }} 
                
                rowData={rowData}
                columnDefs={colDefs}>
            </AgGridReact>
        </div>
    );
}
