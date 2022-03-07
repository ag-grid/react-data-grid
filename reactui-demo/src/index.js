'use strict';

import React, {
  useMemo,
  useEffect,
  useState,
  useRef,
  memo,
  useCallback
} from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

// example based on https://www.ag-grid.com/react-data-grid/reactui/#example-no-wasted-render

// Custom Cell Renderer - note the use of memo to avoid wasted renders
const RenderCounterCellRenderer = memo(params => {
  const renderCountRef = useRef(1);
  return (
    <span className="my-renderer">
      <span className="render-count">({renderCountRef.current++})</span>{' '}
      {params.value}
    </span>
  );
});

function SpinningRenderer(params) {
  return (
        <span className="my-spinner-renderer">
          <img src="https://d1yk6z6emsz7qy.cloudfront.net/static/images/loading.gif" className="my-spinner"/>
            {params.value}
        </span>
  );
}

function GridExample() {
  const [suppressReactUi, setSuppressReactUi] = useState(false);

  const gridRef = useRef();

  const columnDefs = useMemo(
    () => [
      { field: 'athlete', cellRenderer: RenderCounterCellRenderer },
      { field: 'country', cellRenderer: RenderCounterCellRenderer },
      { field: 'gold', cellRenderer: RenderCounterCellRenderer },
      { field: 'silver', cellRenderer: RenderCounterCellRenderer },
      { field: 'age', cellRenderer: SpinningRenderer },
    ],
    []
  );

  // never changes, so we can use useMemo
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      flex: 1
    }),
    []
  );

  // because row data changes, it needs to be state
  const [rowData, setRowData] = useState();

  // gets called once, no dependencies, loads the grid data
  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then(resp => resp.json())
      .then(data => setRowData(data.slice(0, 10)));
  }, []);

  const onClickIncreaseMedals = useCallback(() => {
    const gridApi = gridRef.current.api;
    gridApi.forEachNode(rowNode => {
      ['gold', 'silver'].forEach(colId => {
        const currentVal = gridApi.getValue(colId, rowNode);
        rowNode.setDataValue(colId, currentVal + 1);
      });
    });
  });

  const disableReactUI = useCallback(() => {
    setSuppressReactUi(true);
  });

  const enableReactUI = useCallback(() => {
    setSuppressReactUi(false);
  });

  return (
    <div className={'parent-div'}>
      <div className="buttons-div">
        {!suppressReactUi && <button onClick={disableReactUI}>Disable React Ui</button>}
        {suppressReactUi && <button onClick={enableReactUI}>Enable React Ui</button>}
        <button onClick={onClickIncreaseMedals}>Increase Medals</button>
      </div>
      <div className="grid-div">
        <AgGridReact
          // turn on AG Grid React UI
          suppressReactUi={suppressReactUi}
          // used to access grid API
          ref={gridRef}
          // all other properties as normal...
          className="ag-theme-alpine"
          animateRows="true"
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={rowData}
        />
      </div>
    </div>
  );
}

render(<GridExample />, document.querySelector('#root'));
