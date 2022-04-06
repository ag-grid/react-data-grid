# Updating Row Data

This section covers the functionality of the grid API for programmatically updating data in the the grid: updating, inserting and deleting rows. We will also cover techniques for making updates efficient and handling high volume performant transactions and asynchronous transactions for high frequency transactions.

## Video Tutorial

https://youtu.be/_V5qFr62uhY

00:00 Updating Row Data
00:22 Starting Code
01:15 Inserting Data
03:43 Row Ordering
04:38 Deleting Rows
05:24 Updating Rows
07:27 Adding Large Amounts of Data
10:43 Update Transactions
12:21 Remove Transactions
13:12 High Frequency Updates
18:16 Summary

## Source Code For This Section

The source code for this section is available in Github in the 'react-data-grid' repo and the subfolder `getting-started-video-tutorial/src/009-updating-row-data`:

- https://github.com/ag-grid/react-data-grid/tree/main/getting-started-video-tutorial/src/009-updating-row-data

## Starting Code

### App.js

The code starts from a very simple `App.js` which displays a grid with some car data.

```javascript
import './App.css';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import {createOneCarRecord} from './carFactory';

var numberFormatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});
var myValueFormatter = p => numberFormatter.format(p.value);

let cars = [...new Array(4)].map(() => createOneCarRecord());

function App() {

  const gridRef = useRef();
  const [rowData, setRowData] = useState(cars);
  const [columnDefs, setColumnDefs] = useState([
        { field: 'type'},
        { field: 'year' },
        { field: 'color' },
        { field: 'price', valueFormatter: myValueFormatter}
  ]);

  return (
    <div className="ag-theme-alpine" style={{height: '100%'}}>
      <AgGridReact ref={gridRef}
          animateRows={true} 
          columnDefs={columnDefs}
          />
    </div>
  );
}

export default App;

```

### Value Formatter

The `numberFormatter` is a simple `valueFormatter` which takes the value in the row data and formats it to render it in USD format.

```javascript
var numberFormatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});
var myValueFormatter = p => numberFormatter.format(p.value);
```

The columns use value formatters when they are configured using the `valueFormatter` property on the column definition:

```javascript
{ field: 'price', valueFormatter: myValueFormatter}
```

Full details for value formatters can be found in the documentation:

- https://www.ag-grid.com/react-data-grid/value-formatters/

### Data Factory

To make populating the data simple, we have created a `carFactory.js` which will randomly create the car data rendered in the grid.

```javascript
let sequence = 0;
let carTypes = ['Mazda MX5','BMW M3','Porsche 911',
                'Mercedes S-Class','Aston Martin DBX',
                'Bentley Bentayga'];
let colors = ['Red','Blue','Green','White','Black'];

export function createOneCarRecord() {
    const res = {
        id: sequence,
        type: carTypes[sequence%carTypes.length],
        year: 2010 + (sequence * 7) % 10,
        color: colors[sequence%colors.length],
        price: 20000 + (sequence * 3 * 17 * 19 * 5 * 7) % 40000
    }
    sequence++;
    return res;
}
```

This will help us easily manipulate the data without having to deal with any server side calls or interaction.

## Updating all Data

An easy way to insert data is by amending the `rowData` values in the state.

We can create a simple button, with a handler to manipulate the state:

```javascript
  return (
    <div className="ag-theme-alpine" style={{height: '100%'}}>
      <div>
        <button onClick={onInsertOne}>Insert One</button>
```

And the code to insert the data will be in the `onClick` handler function:

```javascript
  const onInsertOne = useCallback( ()=> {
    const newRecord = createOneCarRecord();
    cars = [newRecord, ...cars];
    setRowData(cars);
  });
```

The `onInsertOne` handler, uses the `carFactory` utility function to create a new random record, and we add this to the front of a new array of rowData, and we amend the grid by calling `setRowData`.

This is the easiest way of updating data but we are completely refreshing the grid each time because the data is seen as 'new' by the grid.

## Efficient Data Inserts

We can make the data inserts more efficient by adding row ids to the data so the grid knows to insert or update row data.

This is similar to the `key` attribute used by React for the same purpose with list elements.

We set the `getRowId` property on the grid with a mechanism for finding the id of the data.

```javascript
      <AgGridReact ref={gridRef}

          getRowId={getRowId}
```

The `{getRowId}` implementation will be a callback function:

```javascript
  const getRowId = useCallback( params => {
    console.log(params);
    return params.data.id;
  });
```

The `params` object has been written to the console so that when you run the code you can see that we are supplied with all the information we need to implement complex functionality:

- `api` - the full grid API
- `columnApi` - the column API
- `data` - which contains all the data for the row

Our callback function returns `params.data.id` because when the data was created by the `carFactory` one of the properties was a unique id:

- `id: sequence,`

This is not rendered as a `field` or column definition but is still present in the data that the grid holds.

When rows are inserted now, the grid will insert a new row and animate the existing rows downwards creating a smooth UI.

The row animation is configured using the `animateRows={true}` code in the grid definition, but it only comes into effect when the `getRowId` function has been configured.

## Row Ordering

To demonstrate ro ordering we will create a new button which will reverse the data in the `rowData`.

The button is added to the JSX in `App.js`:

```javascript
        <button onClick={onReverse}>Reverse</button>
```

And the handler code, will create a new array using the existing objects in the array but in reverse order:

```javascript
  const onReverse = useCallback( () => {
    cars = [...cars].reverse();
    setRowData(cars);
  });
```

We will also configure the `type` column to be sortable:

```javascript
{ field: 'type', sortable: true },
```

The order that records are added into `rowData` is the order that the rows are displayed, as you will see if you click the `Reverse` button.

But, when the `type` column has been sorted, the grid sorting is maintained even when the underlying rowData is re-ordered by the `onReverse` call.

## Deleting Rows

We will demonstrate this by creating functionality to remove selected rows.

We need to configure the grid to allow row selection:

```javascript
          rowSelection={'multiple'}
```

Then add a button which will trigger a function to remove selected rows:

```javascript
<button onClick={onRemove}>Remove Selected</button>
```

Finally write the callback function code to remove the selected rows:

```javascript
  const onRemove = useCallback( () => {
    const selectedNodes 
            = gridRef.current.api.getSelectedNodes();
    const selectedIds = selectedNodes.map( 
              node => node.data.id);
    cars = cars.filter( 
              car => selectedIds.indexOf(car.id) < 0 );
    setRowData(cars);
  });
```

This uses the `gridRef` to access the api for the grid and return the selected nodes:

```javascript
    const selectedNodes 
            = gridRef.current.api.getSelectedNodes();
```

Then we add all the id's into an array of ids and filter out any rows which have that id.

Finally using `setRowData` to update the grid data.

The grid will detect that rows have been removed and animate the grid to nicely remove the rows.

## Updating Rows

To demonstrate updating, we will create a button to trigger the update process:

```javascript
        <button onClick={onUpdate}>Update Some</button>
```

Then the implementation will be a callback:

```javascript
  const onUpdate = useCallback( () => {
    cars = cars.map( car => {
      if (Math.random()>0.5) { return car; }

      return {
        ...car,
        price: car.price 
            + (1000-Math.floor(Math.random()*2000))
      }
    });
    setRowData(cars);
  });
```

To simulate an update process, the `onUpdate` function randomly updates some car records prices and then uses `setRowData` to update the data in the grid.

Because the row ids have been set, the grid will smoothly update only the cell values which have been updated, and React will only re-render the cells which have been updated.

To easily see the updates, the grid has built in functionality for rendering data changes. When the grid property `enableCellChangeFlash` is set to true then the cell background will change colour as it is update.

```javascript
    enableCellChangeFlash={true}
```

Alternatively, the grid has a built in cell renderer called `agAnimateShowChangeCellRenderer` and when a column is configured to use this `cellRenderer` the grid will show the + or - difference in addition to highlighting the value in the cell.

```javascript
        { 
          field: 'price', 
          valueFormatter: myValueFormatter,
          cellRenderer: 'agAnimateShowChangeCellRenderer'
        }
```

Remember to make sure the `enableCellChangeFlash` configuration is commented out when you do this.

## Large Amounts of Data

When using large amounts of data the grid can use transactions instead of the `setRowData`.

### Adding Data with Transactions

To demonstrate this we will create a button to update via transactions:

```javascript
<button onClick={onTxInsertOne}>Tx Insert One</button>
```

The `onTxInsertOne` code to use the transaction is below:

```javascript
  const onTxInsertOne = useCallback( ()=> {
    const newRecord = createOneCarRecord();
    gridRef.current.api.applyTransaction({
      add: [newRecord]
    });
  });
```

`onTxInsertOne` uses the `gridRef` to call the `applyTransaction` api call.

`applyTransaction` takes an object with the items to `add`, `update` or `remove`.

The documentation for `applyTransaction` is online:

- https://www.ag-grid.com/react-data-grid/data-update-transactions/

Transactions are a highly performant way of updating the grid.

We should note however that when we use transactions the `rowData` in the state is not kept in sync because the grid is now managing the row data. `rowData` in this example is now just being used to manage the initial state of the grid.

It is possible to use the api to retrieve the row data from the grid at any time. You can find api calls to do this in the documentation:

- https://www.ag-grid.com/react-data-grid/accessing-data/


### Updating Data with Transactions

To demonstrate updating, we will add a button and a button listener which will perform the update transaction.

```javascript
<button onClick={onTxUpdate}>Tx Update Some</button>
```

The `onTxUpdate` is a variation of our earlier update code, but this time:


- we use the grid api `forEachNode` method to iterate over all the grid data
- instead of using `setRowData` we create an array of all the records to update and then pass them in as the transaction `update` property:

```javascript
  const onTxUpdate = useCallback( () => {
    const updatedRecords = [];

    gridRef.current.api.forEachNode( node => {
      if (Math.random()>0.5) { return; }

      const car = node.data;

      updatedRecords.push({
        ...car,
        price: car.price 
            + (1000-Math.floor(Math.random()*2000))        
      });
    });

    gridRef.current.api.applyTransaction({
      update: updatedRecords
    });
  });
```

We are using the `forEachNode` method because we are letting the grid manage the state of the data internally and `forEachNode` allows us to work with the data stored in the grid directly.

The `update` transaction uses the row id to match up the data and perform efficient updates and this is implemented using the `getRowId` property on the grid definition as covered earlier.


### Removing Data with Transactions

To demonstrate removal with transactions we will once again create a button and an event handler.

```javascript
<button onClick={onTxRemove}>Tx Remove Selected</button>
```

The transaction handler is shown below:

```javascript
  const onTxRemove = useCallback( () => {
    const selectedNodes 
            = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map( 
              node => node.data);

    gridRef.current.api.applyTransaction({
      remove: selectedData
    });
  });
```

The handler uses the grid api to get the current selected nodes, adds the data object to a `selectedData` array which is then used as a the `remove` property of the transaction object.

## High Frequency Updates

The transaction approach above is good for large amounts of data. When we work in a high frequency update environment we should consider using asynchronous transactions.

### Asynchronous Transactions

Asynchronous transactions are a way of grouping updates together which reduces the number of renders required to keep the grid up to date.

To demonstrate we will create a button and listener to add a record asynchronously.

```javascript
<button onClick={onTxAsyncInsertOne}>Tx Async Insert One</button>
```

The listener:

```javascript
  const onTxAsyncInsertOne = useCallback( ()=> {
    const newRecord = createOneCarRecord();
    gridRef.current.api.applyTransactionAsync({
      add: [newRecord]
    });
  });
```

Some differences between `applyTransactionAsync` and `applyTransaction`.


- `applyTransaction` would return a result object.
- `applyTransactionAsync` takes a callback function to handle any results

e.g.

```javascript
    gridRef.current.api.applyTransactionAsync({
      add: [newRecord]
    }, res => {
      console.log(res);
    });
```

The difference between the transaction types will not be noticeable when manually triggered. Behind the scenes the `applyTransactionAsync` is waiting for 50 milliseconds before applying the transaction in case any additional transactions are added to the transaction cache, and if so they are batched in and processed together.

### Asynchronous Transaction Times

The time that the grid waits is configurable with a grid property `asyncTransactionWaitMillis`.

By changing the `asyncTransactionWaitMillis` property to be 5 seconds, there will be a noticeable delay between clicking the button and the transaction taking effect.

```javascript
    asyncTransactionWaitMillis={5000}
```

### Asynchronous Transaction Events

When the batched transaction is complete, the grid triggers an `AsyncTransactionsFlushed` event and it is possible to listen for this event, should we want to have follow on processing to handle the results associated with the batched transaction.

A listener is shown below, and this would write the resulting object to the console.

```javascript
  const onAsyncTxFlushed = useCallback( e => {
    console.log('=============');
    console.log(e);
    console.log('=============');
  }, []);
```

We would also have to set the event handler in the grid properties:

```javascript
    onAsyncTransactionsFlushed={onAsyncTxFlushed}
```

There is one more feature of asynchronous transactions that it is important to know and that is flushing the asynchronous cache.

### Flushing Asynchronous Transaction Cache

We can programmatically bypass the `wait` time and immediately process everything in the transaction cache by using the `flushAsyncTransactions` api call.

To demonstrate we will code a button with an on click handler that calls the API.

The button:

```javascript
    <button onClick={onFlushAsyncTx}>Flush Async Tx</button>
```

The on click handler:

```javascript
  const onFlushAsyncTx = useCallback( () => {
    gridRef.current.api.flushAsyncTransactions();
  }, []);
```

When the button is clicked, any transactions in the cache will be immediately processed, rather than allowing the wait time to timeout.

The puts much more control over the transaction processing and handling in the hands of the programmer.

## Summary

`setRowData` is an easy way to add, remove and update values in the grid. This uses the react component state store to manage the data.

To allow the grid to efficiently match up insertions, removals and updates  the `getRowId` callback on the grid needs to be configured so that rows can be identified uniquely via an `id`.

Transactions are used when there are many rows to update or the data in the grid is large, this is much more efficient. The difference is that when using transactions the grid itself is maintaining the row data store, not the React component.

Asynchronous Transactions are used for high frequency updates, these are cached until the configurable timeout for the async cache is reached. The cache can be flushed and the transactions processed immediately with an API call.

