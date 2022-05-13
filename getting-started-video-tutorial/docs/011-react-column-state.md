# React Column State

In this section we will take a deep dive into Column Definitions showing various configuration options and the column API.

## Video Tutorial

https://youtu.be/aDCepyF_DUY

- 00:00 Starting Code with useMemo
- 00:40 state controlled column definitions
- 01:46 Hiding column definitions
- 02:51 Column Width and State 
- 06:12 State Attributes
- 07:10 null vs undefined
- 09:48 Column Order
- 10:50 Column State API
- 18:30 Row Grouping
- 20:00 Column APIs
- 21:19 Summary

## Starting Code

The starting point for the code is shown below. This is a simple grid configured to render columns for some of the data retrieved from a JSON file. With the width of each column set to 100 pixels.

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

  const defaultColDef = userMemo( ()=> ({
      width: 100
  }));

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(result => result.json())
    .then(rowData => setRowData(rowData))
  }, []);

  return (
    <div className="ag-theme-alpine" style={{height: '100%'}}>
     <AgGridReact
          defaultColDef={defaultColDef}
          rowData={rowData} 
          columnDefs={columnDefs}
          animateRows={true} 
          />
    </div>
  );
}

export default App;
```

## useMemo

Most React examples for AG Grid use `useState` for the column definitions.

```javascript
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
```

In this section we will use `useMemo` because that will help make all the changes easier to understand.

```javascript
 const columnDefs = useMemo( ()=>{
     return [
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
  ]},[]);
```

In a production application either of `useMemo` or `useState` are fine.

## State controlled column definitions

In an application we might want to show different columns in the grid based on a state.

e.g.

```javascript
const [includeMedals, setIncludeMedals] = useState(true);
```

The `useMemo` code can now use that state to return a different column definition based on the `includeMedals` value:

```javascript
 const columnDefs = useMemo( ()=>{

     const withMedals =[
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
    ];

    const withoutMedals = [
        { field: 'athlete' },
        { field: 'age' },
        { field: 'country' },
        { field: 'year' }
        { field: 'date' },
        { field: 'sport' }    
    ]

    return includeMedals ? withMedals : withoutMedals;

  },[includeMedals]);
```

We have removed the 'medals' column definitions in the `withoutMedals` array.

```javascript
        { field: 'gold' },
        { field: 'silver' }
        { field: 'bronze' },
        { field: 'total' }
```

And return a different array depending on the `includeMedals` value:

```javascript
return includeMedals ? withMedals : withoutMedals;
```

The `useMemo` is refreshed when the value of `includeMedals` changes:

```javascript
  },[includeMedals]);
```

To trigger the state change we can add a button to our JSX:

```javascript
      <button onClick={toggleMedals}>Toggle Medals</button>
```

And add a callback to handle the button click:

```javascript
  const toggleMedals = useCallback( ()=> {
    setIncludeMedals( prev => !prev );
  }, []);
```

This change in column definitions would cause the Data Grid to re-render, showing the new column configuration.

## Hiding Columns

We can also achieve the same effect by hiding columns rather than removing the definition.

We will still be amending the columnDefs object but keeping columns consistent and hiding them.

To hide a column we use a `hide` attribute:

```javascript
       { field: 'gold', hide: true },
```

We can implement this in our `useMemo`:

```javascript
 const columnDefs = useMemo( ()=>{
     return [
        { field: 'athlete' },
        { field: 'age' },
        { field: 'country' },
        { field: 'year' }
        { field: 'date' },
        { field: 'sport' },
        { field: 'gold', hide: !includeMedals },
        { field: 'silver', hide: !includeMedals }
        { field: 'bronze', hide: !includeMedals  },
        { field: 'total', hide: !includeMedals  }
  ]},[includeMedals]);
```

## Any Attribute

The basic pattern that we are using here is to make the column definitions dependent on a state, and then we can use that state to configure the column attributes.

For example we could create another button to 'Toggle Headers' which, when clicked, will toggle some column headers to be all capitals.

We would create a state:

```javascript
const [capHeaders, setCapHeaders] = useState(false);
```

Add a button into the JSX:

```javascript
<button onClick={toggleCapHeaders}>Toggle Headers</button>
```

Then this button would toggle a state through `useCallback`:

```javascript
  const toggleCapHeaders = useCallback( ()=> {
    setCapHeaders( prev => !prev );
  }, []);
```

And to implement this we add additional conditional attributes in the `columnDefs` creation:

```javascript
 const columnDefs = useMemo( ()=>{
     return [
        { field: 'athlete',
          headerName: capHeaders ? 'ATHLETE' : 'Athlete'
        },
        { field: 'age',
          headerName: capHeaders ? 'AGE' : 'Age'        
        },
        { field: 'country' },
        { field: 'year' }
        { field: 'date' },
        { field: 'sport' },
        { field: 'gold', hide: !includeMedals },
        { field: 'silver', hide: !includeMedals }
        { field: 'bronze', hide: !includeMedals  },
        { field: 'total', hide: !includeMedals  }
  ]},[includeMedals, capHeaders]);
```

When the button is pressed, the state of `capHeaders` changes. This is a dependency of the `useMemo` so our `columnDefs` are regenerated and the Data Grid re-renders.


## Column Width and State

`width` on a column is an internally managed value for the data grid. Once a column has been created by the grid, the `width` is internally managed, this allows the user to resize the column even though we configured a `width`.

With React when amending the column definitions we have to take care that don't reset values that are managed by the grid.

For example, if we make our columns resizable:

```javascript
  const defaultColDef = useMemo( ()=> ({
    resizable: true,
  }));
```

And set the `width` in the column definitions:

```javascript
        { field: 'athlete',
          headerName: capHeaders ? 'ATHLETE' : 'Athlete',
          width: 100
        },
        { field: 'age',
          headerName: capHeaders ? 'AGE' : 'Age',
          width: 100        
        },
```

If a user resizes the `athlete` or `age` column and then clicks the `Toggle Headers` button. The header name will be changed, the column definition object will be changed and so the `width` will be reset to `100`, losing the user's resizing.

If instead the grid is allowed to manage the width state and we instead manage the `initialWidth` then when the column is resized and the `Toggle Header` button used, the width will remain as the user resized it.

```javascript
        { field: 'athlete',
          headerName: capHeaders ? 'ATHLETE' : 'Athlete',
          initialWidth: 100
        },
        { field: 'age',
          headerName: capHeaders ? 'AGE' : 'Age',
          initialWidth: 100        
        },
```

This is because the grid is internally managing the state of the columns, knows that it has already created the `athlete` and `age` columns and so changes the attributes based on the definition.

This leads on to the caveat that the grid must be able to identify the column either through a `field` or a `colId`.

If we don't set one of these and instead supply a user generate column with a value getter.

e.g.

```javascript
        { 
          valueGetter: p => p.data.athlete,
          headerName: capHeaders ? 'ATHLETE' : 'Athlete',
          initialWidth: 100
        },
```

Each time the `Toggle Header` button was pressed, the data grid would create a new column definition and automatically assign it a new column id so any user resizing would be lost. We could fix this by defining the column id with a `colId` attribute:

```javascript
        { 
          colId: 'bananas',
          valueGetter: p => p.data.athlete,
          headerName: capHeaders ? 'ATHLETE' : 'Athlete',
          initialWidth: 100
        },
```

You can find more information on which attributes are stateful and managed by the grid in the documentation:

- https://www.ag-grid.com/react-data-grid/column-updating-definitions/#changing-column-state


## `null` vs `undefined`

When an attribute is set to `null` the value cleared. When an attribute is set to `undefined` it means do not amend it.

For example if we create an `agePinned` state and use this to configure if the `age` column is pinned or not.

```javascript
  const [agePinned, setAgePinned] = useState(undefined);
```

Change the column definition to use the `agePinned` state:

```javascript
          { 
            field: 'age',
            pinned: agePinned,
            headerName: capHeaders ? 'AGE' : 'Age'
          },
```

Remembering to add the state to the `useMemo` dependencies:

```javascript
  ]},[includeMedals, capHeaders, agePinned]);
```

A set of buttons which can set the `agePinned` state.

```javascript
      <br/>
      Set Age Pinned:
      <button onClick={()=>setAgePinned('left')}>Left</button>
      <button onClick={()=>setAgePinned('right')}>Right</button>
      <button onClick={()=>setAgePinned(null)}>NULL</button>
      <button onClick={()=>setAgePinned(undefined)}>undefined</button>
```

If we click the buttons: left, right, NULL. Then the column will be pinned left, then to the right and then finally unpinned.

If we click the buttons: left, right, undefined. Then the column will be pinned left, then to the right and then finally remain pinned to the right because the `undefined` setting means "don't change the state managed internally by the grid".

## Column Ordering

With AG Grid the user has the ability to re-order the columns.

If the user re-orders columns and we refresh the column definitions then the user defined ordering will be lost because columns will be recreated in the order that they are defined.

To allow the grid to maintain column ordering during column redefinitions we add a new property to the grid definition `maintainColumnOrder`:

```javascript
      <AgGridReact
          maintainColumnOrder={true}
          defaultColDef={defaultColDef}
          rowData={rowData}
          animateRows={true} 
          columnDefs={columnDefs}
          />
```

## Column State API

The grid has the ability to return and set the state of all columns. This is normally done in the sequence of:

- get the current state and store it
- restore the previously stored state

But, if you want to set the full column state object yourself then you could set the column state this way.

Allow our code to access the grid api by adding a ref and hooking it up to the grid.

```javascript
  const gridRef = useRef();
```

Then hook it up to the grid.

```javascript
      <AgGridReact ref={gridRef}
          maintainColumnOrder={true}
```  


Create a reference so that we can save the state.

```javascript
const savedColState = useRef();
```

Implement the code to use the API to save the state into our ref:

```javascript
  const onSaveColState = useCallback( ()=> {
    const colState = 
        gridRef.current.columnApi.getColumnState();
    console.log('Saving Column State', colState);
    savedColState.current = colState;
  }, []);

  const onRestoreColState = useCallback( ()=> {
    console.log('Restoring Column State', 
                      savedColState.current);
    gridRef.current.columnApi.applyColumnState(
                      {state: savedColState.current});
  }, []);
```

Create some buttons to allow the user to control when the state is saved and restored.

```javascript
      <br/>
      <b>Column State</b>
      <br/>
      <button onClick={onSaveColState}>Save State</button>
      <button onClick={onRestoreColState}>Restore State</button>
```

We can use the API to set the column state from a state object, this can provide a lot of run time control over the datagrid.

e.g.

```javascript
  const onWidth100 = useCallback( ()=> {
    gridRef.current.columnApi.applyColumnState(
      {
        state: [
          { colId: 'athlete', width: 100 }
        ]
      }
    );
  }, []);
```

Then a button in the JSX to allow the user to trigger this.

```javascript
      <br/>
      <button onClick={onWidth100}>Width 100</button>
```      

When the button is clicked the `width` of the `athlete` column would be set to 100.

Only the columns listed in the state are amended, and only the attributes listed in the state are amended.

Any of the column state attributes can be used, also if we use `null` then the attribute will be cleared and if we use `undefined` then no change will be made to the attribute.

We can also use a `defaultState` to amend any unlisted column e.g. the code below will set the `athlete` to `width` of 100 and all other columns to `width` of 200.


```javascript
  const onWidth100 = useCallback( ()=> {
    gridRef.current.columnApi.applyColumnState(
      {
        state: [
          { colId: 'athlete', width: 100 }
        ],
        defaultState: {
          width: 200
        }
      }
    );
  }, []);
```

We can sort columns using `sort` of `desc` or `asc` and can set multiple columns in the sort by additionally using the `sortIndex` e.g.

```javascript
      {
        state: [
          { colId: 'gold', sort: 'desc', sortIndex: 0 },
          { colId: 'silver', sort: 'desc', sortIndex: 1 }
        ],
        defaultState: {
          sort: null
        }
      }
```

The defaultState is used to clear sorting on any other column.

NOTE: you can't set `width` to `null` because it needs to be an integer.

We can also use the state setting to set the order of the columns. The code below, due to the presence of the `applyOrder` property would set the `gold` and `silver` columns to be first in the grid.

```javascript
      {
        state: [
          { colId: 'gold', sort: 'desc', sortIndex: 0 },
          { colId: 'silver', sort: 'desc', sortIndex: 1 }
        ],
        defaultState: {
          sort: null
        },
        applyOrder: true
      }
```

## Row Grouping

Row grouping is an enterprise feature so we would need to make sure we have installed AG Grid enterprise:

```
npm install ag-grid-enterprise
```

And then import the enterprise features into our code.

```javascript
import 'ag-grid-enterprise';
```

We can now use the `applyColumnState` api method to group rows.

```javascript
  const onGrouping = useCallback( ()=> {
    gridRef.current.columnApi.applyColumnState(
      {
        state: [
          { colId: 'athlete', rowGroupIndex: 1, hide: true }, 
          { colId: 'country', rowGroupIndex: 0, hide: true }, 
          { colId: 'gold', aggFunc: 'sum'},
          { colId: 'silver', aggFunc: 'sum'},
          { colId: 'bronze', aggFunc: 'sum'},
          { colId: 'total', aggFunc: 'sum'},
        ],
        applyOrder: true
      }
    );
  }, []);
```

And a JSX button to trigger the grouping.

```javascript
      <button onClick={onGrouping}>Group Country Athlete</button>
```

This would group rows by `country` and then additionally by `athlete`. The order of the grouping is controlled by the `rowGroupIndex` rather than the order of the columns. The grouping columns are also set to `hide` because they are seen in the header group.

For the grouping header rows the `gold`, `silver`, `bronze` and `total` columns would have the aggregated value as a `sum` of all the values in the grouping for that column.

## Column API

We can use the column API to have low level control over the grid. We could if wanted, use the column API to replicate the same functionality we achieved with the `applyColumnState` method.

```javascript
  const onGroupViaApi = useCallback( ()=> {
    gridRef.current.columnApi.setRowGroupColumns(
                            ['country','athlete']);
    gridRef.current.columnApi.setColumnsVisible(
                            ['country','athlete'], false);
    gridRef.current.columnApi.setValueColumns(
                            ['silver','bronze','gold','total']);
    gridRef.current.columnApi.setColumnAggFunc(
                            'silver','sum');
    gridRef.current.columnApi.setColumnAggFunc(
                            'bronze','sum');
    gridRef.current.columnApi.setColumnAggFunc(
                            'gold','sum');
    gridRef.current.columnApi.setColumnAggFunc(
                            'total','sum');
  }, []);
```

And if we enable this via a button in the JSX:

```javascript
      <b>Column API</b>
      <br/>
      <button onClick={onGroupViaApi}>Group Country Athlete</button>
```

The sequence of API calls replicates the same functionality we achieved when setting the state and using the row grouping.

## Summary

In this section we covered setting the state of the grid by redefining the column definitions, using the `applyColumnState` API method, and using the Column API directly.

The `columnDefs` are the best way to initially define the columns.

The `applyColumnState` API and associated `ColumnStateParams` is probably the easiest way to programmatically control the state of the grid at runtime.

You can find this fully documented in the official documentation:

- https://www.ag-grid.com/react-data-grid/column-state/

