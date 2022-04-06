
# Enterprise Overview

In this section you will learn how to enable the enterprise features of AG Grid. These are free to trial and require a license to use in production. All enterprise features are listed in the documentation.

## Enterprise Overview Video

In the video Niall Crosby demonstrates how to enable enterprise features and the Row Grouping.

https://youtu.be/pKUhYE1VTP4

- 00:00 Setting up Enterprise
- 02:08 Row Grouping
- 02:30 User Controlled Grouping
- 03:13 Enterprise Features Listed
- 03:33 Enterprise License

## Source Code For This Section

The source code for this section is available in Github in the 'react-data-grid' repo and the subfolder `getting-started-video-tutorial/src/002-enterprise-overview`:

- https://github.com/ag-grid/react-data-grid/tree/main/getting-started-video-tutorial/src/002-enterprise-overview


## Starting Code

A basic project which setups a grid and loads data from a json file on the server.

```javascript
import './App.css';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import 'ag-grid-enterprise';

import {useState, useRef, useEffect, useMemo, useCallback} from 'react';

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
      sortable: true, 
      filter: true,
  }), []);

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(result => result.json())
    .then(rowData => setRowData(rowData))
  }, []);

  return (
    <div className="ag-theme-alpine" style={{height: '100%'}}>
      <AgGridReact ref={gridRef}    
          rowData={rowData} animateRows={true} 
          columnDefs={columnDefs} defaultColDef={defaultColDef}          
          />
    </div>
  );
}

export default App;
```

The dependencies currently only include `ag-grid-community` and `ag-grid-react`.

We can install the enterprise package using npm

```shell
npm install --save ag-grid-enterprise
```

This will add `ag-grid-enterprise` into the `package.json` file:

```json
    "ag-grid-community": "^27.0.1",
    "ag-grid-enterprise": "^27.0.1",
    "ag-grid-react": "^27.0.1",
```

All are needed to use enterprise. The `ag-grid-community` has the base features and `ag-grid-enterprise` adds the enterprise features like grouping, pivoting, aggregation, charts, and excel Export.

Finally to make the application use the Enterprise features we need to import the library into our code.

By adding:

```javascript
import 'ag-grid-enterprise';
```

## Row Grouping

We can add row grouping as a column definition property:

```javascript
        { field: 'country', rowGroup: true },
```

This would group all rows by specific countries.

We can add row grouping for multiple columns:

```javascript
        { field: 'country', rowGroup: true },
         { field: 'year', rowGroup: true },
```

This would group by Country and then year e.g.

```
> United States (1109)
v Russia (706)
   > 2000 (168)
   v 2012 (129)
       ...
```

The cells are expandable to show the data in the group.

## User Controlled Grouping

The above code defines default grouping. It is also possible to allow the user to configure the grouping.

To do that, remove the column definition `rowGroup` properties and add a default column definition property `enableRowGroup`.

```javascript
 const defaultColDef = useMemo( ()=> ( {
      sortable: true, 
      filter: true,
      enableRowGroup: true
  }), []);
```

It is possible to add this property to individual columns as some might not be suitable for grouping but by adding it to the default column definition the user can group by all columns by dragging the columns into a drop zone.

We can enable the drop zone with a grid property `rowGroupPanelShow='always'`.

This is shown in context below:

```javascript
      <AgGridReact ref={gridRef}
          rowGroupPanelShow='always'
          rowData={rowData} animateRows={true} 
          columnDefs={columnDefs} defaultColDef={defaultColDef}          
          />
```

## Enterprise License

Enabling the enterprise features causes a watermark to appear on the grid and a set of warnings to appear in the console.

These can be removed by purchasing a license.

You can use the community edition of AG Grid free of charge in commercial applications.

You can evaluate the enterprise features of AG Grid, simply by enabling them in the grid, you need a license to develop and release enterprise features to production.

You can trial AG Grid Enterprise for free, without asking AG Grid. If you need a trial license to remove the warning message or watermark then contact info@ag-grid.com

You can find information on the enterprise features in the documentation:

https://www.ag-grid.com/vue-data-grid/licensing/
