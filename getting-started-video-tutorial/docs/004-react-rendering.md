# React Rendering

AG Grid has a 100% React Rendering Engine, and in this section we will demonstrate that by looking at the controlled rendering for AG Grid.

## Tutorial Video

https://youtu.be/oAQ5vavDupU

00:00 AG Grid is 100% React
00:10 Starting Code Explained
00:25 Custom React Component
00:54 Developer Tools Rendering View
01:56 Wasted Renders Demonstration
03:00 Avoiding Waster Renders with memo
03:28 Summary

## Source Code For This Section

The source code for this section is available in Github in the 'react-data-grid' repo and the subfolder `getting-started-video-tutorial/src/004-react-rendering`:

- https://github.com/ag-grid/react-data-grid/tree/main/getting-started-video-tutorial/src/004-react-rendering


## Starting Code

Our starting point is a simple app which renders data from a server side JSON file in a grid.

```javascript
import './App.css';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

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

To demonstrate the rendering we will create a custom React Component that renders a spinning loading gif to the left of the value of the cell.

The video uses the following code.

```javascript
function MyComp = params => {
    const imageUrl = ="https://d1yk6z6emsz7qy.cloudfront.net/static/images/loading.gif" ;
    const imgStyle = {width: 40, top: 0, left:0, position: 'absolute'}
    const style = {marginLeft:20 }
    return (
        <span style={style}>
            <img src={imageUrl} style={imgStyle} />
            {params.value}
        </span>
    );
}
```

But you want to simplify the code then you can use a simple value cell renderer.

```javascript
const MyComp = params => {
  return (
    <>{params.value}</>
  );
};
```

And then have the `age` column use that cell renderer:

```javascript
{ field: 'age', cellRenderer:MyComp },
```

If we view the React hierarchy in the dev tools we will see that the Grid is 100% React.

## Wasted Renders

To demonstrate avoiding wasted renders, we will use a simpler cell renderer that counts the number of times a cell has been rendered.

```javascript
const MyComp = params => {
  const renderCountRef = useRef(1);
  return (
    <><b>({renderCountRef.current++})</b> {params.value}</>
  );
};
```

We can use this in all the cells by adding this to the default column definition.

```javascript
  const defaultColDef = useMemo( ()=> ( {
      sortable: true, 
      filter: true,
      cellRenderer: MyComp
  }), []);
```

If the columns of the grid were to be re-ordered manually then would see that the cells were being re-rendered with each column move. This is because we haven't optimized our component to avoid wasted renders.

The grid needs to re-render because the columns have moved, but the cells have not changed value so they should not need to be re-rendered.

## Avoiding Wasted Renders

If we memoize the column definition then we will avoid a lot of re-renders.

```javascript
  const defaultColDef = useMemo( ()=> ( {
      sortable: true, 
      filter: true,
      cellRenderer: memo(MyComp)
  }), []);
```

This requires importing `memo` from `react`:

```javascript
import {useState, useRef, useEffect, useMemo, useCallback, memo} from 'react';
```

This additional `memo` will prevent the cell from being re-rendered if the value has not changed.