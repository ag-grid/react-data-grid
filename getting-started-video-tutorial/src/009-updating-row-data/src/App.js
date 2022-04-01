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
        { field: 'type', sortable: true },
        { field: 'year' },
        { field: 'color' },
        { 
          field: 'price', 
          valueFormatter: myValueFormatter,
          cellRenderer: 'agAnimateShowChangeCellRenderer'
        }
  ]);

  const onInsertOne = useCallback( ()=> {
    const newRecord = createOneCarRecord();
    cars = [newRecord, ...cars];
    setRowData(cars);
  });

  const onTxInsertOne = useCallback( ()=> {
    const newRecord = createOneCarRecord();
    const res = gridRef.current.api.applyTransaction({
      add: [newRecord]
    });
    console.log(res);
  });

  const onTxAsyncInsertOne = useCallback( ()=> {
    const newRecord = createOneCarRecord();
    gridRef.current.api.applyTransactionAsync({
      add: [newRecord]
    }, res => {
      console.log(res);
    });
  });

  const getRowId = useCallback( params => {
    return params.data.id;
  });

  const onRemove = useCallback( () => {
    const selectedNodes 
            = gridRef.current.api.getSelectedNodes();
    const selectedIds = selectedNodes.map( 
              node => node.data.id);
    cars = cars.filter( 
              car => selectedIds.indexOf(car.id) < 0 );
    setRowData(cars);
  });

  const onTxRemove = useCallback( () => {
    const selectedNodes 
            = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map( 
              node => node.data);

    gridRef.current.api.applyTransaction({
      remove: selectedData
    });
  });

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

  const onReverse = useCallback( () => {
    cars = [...cars].reverse();
    setRowData(cars);
  });

  const onAsyncTxFlushed = useCallback( e => {
    console.log('=============');
    console.log(e);
    console.log('=============');
  }, []);

  const onFlushAsyncTx = useCallback( () => {
    gridRef.current.api.flushAsyncTransactions();
  }, []);

  return (
    <div className="ag-theme-alpine" style={{height: '100%'}}>
      <div>
        <button onClick={onInsertOne}>Insert One</button>
        <button onClick={onReverse}>Reverse</button>
        <button onClick={onRemove}>Remove Selected</button>
        <button onClick={onUpdate}>Update Some</button>
      </div>
      <div>
        <button onClick={onTxInsertOne}>Tx Insert One</button>
        <button onClick={onTxRemove}>Tx Remove Selected</button>
        <button onClick={onTxUpdate}>Tx Update Some</button>
      </div>
      <div>
        <button onClick={onTxAsyncInsertOne}>Tx Async Insert One</button>
        {/* <button onClick={onFlushAsyncTx}>Flush Async Tx</button> */}
      </div>
      <AgGridReact ref={gridRef}
          // enableCellChangeFlash={true}
          // onAsyncTransactionsFlushed={onAsyncTxFlushed}
          asyncTransactionWaitMillis={5000}
          getRowId={getRowId}
          rowSelection={'multiple'}
          rowData={rowData} 
          animateRows={true} 
          columnDefs={columnDefs}
          />
    </div>
  );
}

export default App;
