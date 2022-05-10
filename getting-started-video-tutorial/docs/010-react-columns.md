# React Columns

In this section we will take a deep dive into Column Definitions showing various configuration options and the column API.


## Video Tutorial

https://youtu.be/aDCepyF_DUY

- 00:00 Starting Code
- 00:20 Column Headers
- 00:52 Resizing
- 01:05 Default Column Definition
- 01:32 Column Width
- 03:35 Sorting and Editing
- 04:11 Field property
- 04:28 Value Getters
- 05:46 Value Formatters
- 06:49 Pinning Columns
- 08:53 Lock Position
- 09:17 Hiding Columns
- 09:48 Tooltips
- 10:44 Column Groups
- 13:42 Column API
- 18:59 Column Ids
- 21:32 State vs API Usage

## Starting Code

The starting point for the code is shown below. This is a simple grid configured to render columns for some of the data retrieved from a JSON file.

```javascript
import './App.css';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {useState, useEffect, useMemo, useRef, useCallback} from 'react';

function App() {

  const [rowData, setRowData] = useState();
  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
        { field: 'athlete' },
        { field: 'age' },
        { field: 'country' },
        { field: 'year' }
        { field: 'date' },
        { field: 'sport' },
        { field: 'gold' },
        { field: 'silver' }
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
     <AgGridReact
          rowData={rowData} 
          columnDefs={columnDefs}
          animateRows={true} 
          />
    </div>
  );
}

export default App;
```

## Default Column Headers

The minimum definition for a column is the `field` declaration.

AG Grid will do its best to render this in an aesthetic way for the user, it does this by assuming columns are written using Camel Case.

For example, lower case will be converted to have the first letter as upper case so `athlete` would become `Athlete`.

```javascript
        { field: 'athlete' },
```

Camel case is used to identify spaces in words e.g. `athleteTwoThree` becomes `Athlete Two Three`.

```javascript
        { field: 'athleteTwoThree' },
```

## Define Header Names Explicitly

The name of a column can be set using the `headerName` property.

e.g.

```javascript
        { 
            headerName: 'Competitor',
            field: 'athlete'
        },
```

The above code would create a column with a header titled "Competitor" and would render the data from the 'athlete' field in the data.

## Resizable Columns

To make a column resizable add the resizable property:

```javascript
        { 
            headerName: 'Competitor',
            field: 'athlete',
            resizable: true
        },
```

This allows the user to resize the columns by dragging the column width.

## Default Column Properties

Properties that we want to be applied to a column by default can be added by using default column definitions, this is done by creating an object which is applied as a `defaultColDef` prop on the grid.

```javascript
    const defaultColDef = useMemo( ()=>({
        resizable: true
    }),[]);
```

The above object contains the default column definitions, then we add to the grid as a prop:

```javascript
     <AgGridReact
        defaultColDef={defaultColDef}
        rowData={rowData} 
```

Any property that can be added to a column definition can be added as a default column definition.

## Specifying Column Width

We can configure the column width with the `width` property which is specified in terms of pixels:

```javascript
        { field: 'age', width: 100 },
```

We just defined the `age` column to be 100 pixels wide.

The default column width is 200 pixels wide.

The column can also have a minimum and maximum width:

```javascript
    { 
        field: 'age', 
        width: 100,
        minWidth: 80,
        maxWidth: 200
    },
```

With the `minWidth` and `maxWidth` properties set, a resizable column can not be sized below the `minWidth` or above the `maxWidth`.

When we want all the columns to fit into the width of the grid and avoid having a horizontal scrollbar.

By removing `width`, `minWidth` and `maxWidth` from any columns then setting the `flex` on the `defaultColDef` all the columns would fit the width of the grid.

```javascript
    const defaultColDef = useMemo( ()=>({
        resizable: true,
        flex: 1
    }),[]);
```

The `flex` is a weighting value, so `2` would mean 'double the size' of other columns.

e.g.

```javascript
        { 
            headerName: 'Competitor',
            field: 'athlete',
            flex: 2
        },
```

When a column is manually resized the `flex` value for that column is no longer used, instead the user controls the width, but all the other columns will 'flex' into the rest of the space in the grid.

## Sorting and Editing

A column can be made editable by using the `editable` property.

```javascript
        { 
            headerName: 'Competitor',
            field: 'athlete',
            editable: true,
            flex: 2
        },
```

Adding the `sortable` property makes a column sortable.

```javascript
        { 
            headerName: 'Competitor',
            field: 'athlete',
            editable: true,
            sortable: true,
            flex: 2
        },
```

`editable` and `sortable` are very often used on the `defaultColDef` to apply to all columns.

```javascript
    const defaultColDef = useMemo( ()=>({
        resizable: true,
        flex: 1,
        editable: true,
        sortable: true
    }),[]);
```

## Column Values

### Field Property

Most examples of the `field` you will encounter use a single value.

```javascript
        { field: 'athlete' },
```

If the value on the underlying data is an object then it is possible to reference sub objects using dot notation.

Assuming that the `athlete` value is on `bar` object on `foo` object we would write:

```javascript
        { field: 'foo.bar.athlete' },
```

### Value Getters

Values can also be returned from a Value Getter. A Value Getter is a function that returns a value, possibly a calculate value using combinations of other values in the row.

```javascript
        { 
            headerName: 'Competitor',
            valueGetter: p => {
                console.log(p);
                return Math.random();
            },
            flex: 2
        },
```

By using the code above, the Competitor column would be filled with a random number.

This example also demonstrates that it is possible to have columns which don't have an underlying value in the data set and are purely dynamically calculated values.

The `console.log` is simply there to print out the objects that are available to the `valueGetter` and 

You can find the details of the params in the documentation:

- [ag-grid.com/react-data-grid/value-getters/](https://www.ag-grid.com/react-data-grid/value-getters/)


The value getter has access to the grid and column APIs, the column definitions and also the data in the row.

To access the data we could use `p.data.athlete` this would return the `athlete` field from the row `data` values:

```javascript
    valueGetter: p => {
        return p.data.athlete;
    },
```

This is equivalent to using the field directly:

```javascript
        { field: 'athlete'}
```

### Value Formatters

A Value Formatter is used to change the format of the data in the cell e.g. to show the value of the cell surrounded by `[]` we might use a `valueFormatter` like the one below:

```javascript
    valueFormatter: p => {
        return '[' + p.value + ']';
    },
```

The order applied is:

- `valueGetter` to get the value, this would override any `field` value specified
- `valueFormatter` to format the value
- `cellRenderer` to render the value in the cell

Use a `valueFormatter` to change the basic format, use a `cellRenderer` to change how the value is rendered in the HTML.

## Pinning Columns

Columns can be pinned to the left and right of the grid so that the user can not move them.

```javascript
        { 
            headerName: 'Competitor',
            field: 'athlete',
            pinned: 'left'
        },
```

To pin to the right we use `pinned: right`

```javascript
        { 
            field: 'age',
            pinned: 'right'
        },
```

When a column is pinned to the left and another to the right, the rest of the column data will be scrollable between them.

Multiple columns can be pinned to both right and left.

### User Pinning

It is possible for a user to pin columns by dragging them to the left or right and holding until the pin icon is displayed, then when they stop dragging the column will be pinned in the grid.

This default behaviour of the grid can be disabled using the `lockPinned` attribute.

```javascript
        { 
            headerName: 'Competitor',
            field: 'athlete',
            pinned: 'left'
            lockPinned: true
        },
```

When `lockPinned` is used on a pinned column as per the example above, it means that the column will be pinned and the user can not unpin it.

```javascript
        { 
            field: 'age',
            lockPinned: true
        },
```

If `lockPinned` is used on a column without a `pinned` property then the user can not drag the column to pin it.

### Lock Position

The `lockPosition` property means that a column can not be moved or have any column moved or pinned before it.

```javascript
        { 
            headerName: 'Competitor',
            field: 'athlete',            
            lockPosition: true
        },
```

The above code would prevent the `Competitor` column from being moveable and would prevent any pinning on the left of the grid because the `Competitor` column is on the left most of the grid.

### Hidden Columns

Columns can be hidden and prevented from displaying in the grid using the `hide` property.

```javascript
        { 
            headerName: 'Competitor',
            field: 'athlete',            
            hide: true
        },
```

The `Competitor` column is no longer visible in the grid but the `athlete` data values are still available to other columns in the `data` attribute in params passed through to value getters or value formatters.

When using the Enterprise edition of AG Grid, users can use the side panels to toggle hidden columns on and off. This behaviour can be prevented by using the `lockVisible` property.

```javascript
        { 
            headerName: 'Competitor',
            field: 'athlete',            
            hide: true,
            lockVisible: true
        },
```

`lockVisible: true` would prevent the user or the API hiding or making visible the column.

## Tooltips

We can use a value from another field as a tooltip using the `tooltipField` property.

```javascript
        { 
            headerName: 'Competitor',
            field: 'athlete',            
            tooltipField: 'country'
        },
```

When a user hovers their mouse over the value of the `Competitor` column a tooltip showing the value from the `Country` would be shown.

It is also possible to create `tooltipValueGetter` and `tooltipValueFormatter` functions. These work just like the `valueGetter` and `valueFormatter` on the column definitions but instead of displaying the values in the cells, the values are shown in the pop up tooltips.

e.g.

```javascript
        { 
          field: 'age',
          tooltipValueGetter: p => Math.random()
        },   
```

Additionally we also have `headerTooltip` to enable a tooltip for the column header itself.

## Column Groups

Column grouping allows multiple rows of headers to be used with the sub headers grouped under a parent header.

For example the code below groups the `gold`, `silver`, `bronze` and `total` columns under a `Medal` group header.

```javascript
        { 
          headerName: 'Medals',
          children: [
            { field: 'gold'},
            { field: 'silver'},
            { field: 'bronze'},
            { field: 'total'},
          ]
        },
```

In the above configuration child columns can be moved out of the group and splitting the group header.

The ability to move columns outside the group can be prevented by adding the `marryChildren` property.

```javascript
        { 
          headerName: 'Medals',
          marryChildren: true,
          children: [
            { field: 'gold'},
            { field: 'silver'},
            { field: 'bronze'},
            { field: 'total'},
          ]
        },
```

With `marryChildren: true` the child columns can not be moved outside of the parent group header. 

Column groups also support being opened and closed. This provides a convenient mechanism for users to hide and reveal sections of the data.

```javascript
        { 
          headerName: 'Medals',
          marryChildren: true,
          children: [
            { field: 'total' },
            { field: 'gold', columnGroupShow: 'open' },
            { field: 'silver', columnGroupShow: 'open'  },
            { field: 'bronze', columnGroupShow: 'open'  },
          ]
        },
```

The configuration below means that the `gold`, `silver` and `bronze` columns will only be shown when the `Medals` header column is toggled open. `total` will **only** be visible when the `Medals` header column is closed.

```javascript
        { 
          headerName: 'Medals',
          marryChildren: true,
          children: [
            { field: 'total', columnGroupShow: 'closed' },
            { field: 'gold', columnGroupShow: 'open' },
            { field: 'silver', columnGroupShow: 'open'  },
            { field: 'bronze', columnGroupShow: 'open'  },
          ]
        },
```

It is possible to nest header columns as much as you require e.g.

```javascript
    { 
        headerName: 'AAA',
        children: [
        { 
            headerName: 'BBB',
            children: [
                { 
                headerName: 'CCC',
                children: [
                    { 
                        field: 'age'
                    },
                    { 
                        field: 'age'
                    },
                ]
                },
            ]
        },
        ]
    },
```

## Column API

The column API can be used to create run time configuration and behaviour.

To access the Grid API we need to add a reference to the grid.

```javascript
  const gridRef = useRef();
```

The reference is for the grid so we add that to the grid properties.

```javascript
     <AgGridReact
          ref={gridRef}
          defaultColDef={defaultColDef}
          rowData={rowData} 
          columnDefs={columnDefs}
          animateRows={true} 
          />
```

We can add some code to use the API by rendering a button through the JSX:

```javascript
  return (
    <div className="ag-theme-alpine" style={{height: '100%'}}>
      <button onClick={onPushMe}>Push Me</button>
     <AgGridReact
          ref={gridRef}
```

And then a method which will eventually use the API.


```javascript
  const onPushMe = useCallback( ()=> {
    console.log('Push Me Clicked');
  }, []);
```

We can now make it use the API:

```javascript
  const onPushMe = useCallback( ()=> {
    const allColumns = 
          gridRef.current.columnApi.getAllColumns();
    const displayedColumns = 
          gridRef.current.columnApi.getAllDisplayedColumns();

    console.log('All Columns', allColumns);
    console.log('Displayed Columns', displayedColumns);
  }, []);
```

The above code will render to the console arrays with details of all the Column objects, and all the visible columns.

A Column object is a representation of the definitions that are passed in when the grid is created, this maintains the state of the Column.

Full details of the Column object can be found in the documentation:

[ag-grid.com/react-data-grid/column-object/](https://www.ag-grid.com/react-data-grid/column-object/)



## Column ID

By default a column is given an ID which matches the field name.

This won't work as well when the same field is used in multiple columns or we have columns that are implemented with value getters.

When fields are added multiple times the first column will be given an ID using the name of the field, subsequent uses will be given IDs with a numeric prefix e.g. `age`, `age_1`.

When columns are added with value getters then the ID will be an incrementing integer e.g. `0`, `1`.

We can control the column ID by adding one in the column definition:

```javascript
        { 
          colId: 'age-A',
          field: 'age',
        }
```

Specific columns can be accessed using the `getColumn` method which takes the ID as a parameter, for example the code below gets the 'year' column and then pins it to the left of the grid.

```javascript
    const yearCol = 
          gridRef.current.columnApi.getColumn('year');

    gridRef.current.columnApi.setColumnPinned(yearCol, 'left');

    console.log('Year Column', yearCol);
```