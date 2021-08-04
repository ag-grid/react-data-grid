import React, { Component } from 'react';
import './App.css';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import { NumberFormatter } from './NumberFormatter';
import { NumericCellEditor } from './NumericEditor';
import { RangeFilter } from './RangeFilter';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rowData: []
        }
    }

    componentDidMount() {
        fetch('https://www.ag-grid.com/example-assets/row-data.json')
            .then(result => result.json())
            .then(rowData => this.setState({rowData}))
    }

    render() {
        return (
            <div
                className="ag-theme-balham"
                style={{height: '200px', width: '600px'}}
            >
                <AgGridReact
                    defaultColDef={{sortable: true, filter: true }}
                    pagination={true}

                    frameworkComponents={ {
                        'numberFormatter': NumberFormatter,
                        'numericCellEditor': NumericCellEditor,
                        'rangeFilter': RangeFilter
                    }}

                    rowData={this.state.rowData}>

                    <AgGridColumn field="make"></AgGridColumn>
                    <AgGridColumn field="model"></AgGridColumn>
                    <AgGridColumn field="price" editable= {true}
                                        cellRenderer= 'numberFormatter'
                                        cellEditor= 'numericCellEditor'
                                        filter= 'rangeFilter'
                                        ></AgGridColumn>
                </AgGridReact>
            </div>
        );
    }
}

export default App;