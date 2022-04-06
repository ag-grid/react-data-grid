
# Customizing Cells

Customizing cells using React Cell Renderers, these are simple functions that return JSX to add your own React component to format and add interactivity to the cells in a data grid. These can be created as functional components, anonymous inline functions or class components.

## Tutorial Video

https://youtu.be/9IbhW4z--mg

00:00 React Components in Cells
00:27 Create a Cell Renderer Component
01:40 Adding interactivity
02:32 Reusing Components
03:03 Cell Renderer Params
04:04 Inline Components
04:42 Class Components
05:38 Cell Renderer Selector
07:00 Summary


## Source Code For This Section

The source code for this section is available in Github in the 'react-data-grid' repo and the subfolder `getting-started-video-tutorial/src/003-customizing-cells`:

- https://github.com/ag-grid/react-data-grid/tree/main/getting-started-video-tutorial/src/003-customizing-cells



## Starting Code

The starting code uses a variant of the olympic winners code from the Enterprise Quickstart, with the enterprise features removed.

This has column definitions which match data from a JSON file retrieved from a server.

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
      filter: true
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

## Create a Cell Renderer Component

To demonstrate a simple cell renderer, create a functional component which renders "Hello World" in the cell.

```javascript
const SimpleComp = p => <>Hello World!</>
```

Then configure the `athlete` column to use this cell renderer:

```javascript
    { field: 'athlete', cellRenderer: SimpleComp },
```

This will cause all Athlete cells to show "Hello World!"

## Understanding Cell Renderer Params

Full details of the cell renderer parameters can be found in the documentation:

https://www.ag-grid.com/react-data-grid/component-cell-renderer/

But you can experiment yourself by logging the parameters to the console, this can be a useful way to experiment with the grid without consulting the docs all the time.

```javascript
const SimpleComp = p => {
    console.log(p);
    return <>Hello World!</>
}
```

The two most used properties for cell renderers are:

- `value` which contains the value of the cell's row data
- `data` which provides access to the raw data for each cell in the row

You also have access to the grid and column APIs and a variety of other objects. We provide you with all the information you'll need to create custom cell renderers that are heavily configurable.

We can return the cell to the default behavior by returning the value:


```javascript
const SimpleComp = p => {
    return <>{p.value}</>
}
```

This is a good basis from which to build a more complicated cell renderer.

## Adding interactivity

The cell renderer can return any JSX we want so we can easily add interactivity by adding some buttons to render data.

```javascript
const SimpleComp = p => {
    const onDollar = useCallback( ()=> window.alert('Dollar ' + p.value));
    const onAt = useCallback( ()=> window.alert('At ' + p.value));
    return (
        <>
            <button onClick={onDollar}>$</button>
            <button onClick={onAt}>@</button>
            {p.value}
        </>);
}
```

Every cell would now have two additional buttons, clicking the button would show the appropriate alert.

## Reusing Components

The same cell renderer can be used on multiple cells, e.g.

```javascript
  const [columnDefs, setColumnDefs] = useState([
        { field: 'athlete', cellRenderer: SimpleComp },
        { field: 'age', cellRenderer: SimpleComp },
        { field: 'country', cellRenderer: SimpleComp },
...         
```

Three cells would now have the extra buttons which trigger alerts to show the value, the `athlete`, `age` and `country` columns.

The cell renderer could also be used on the default column to make it easy to style every cell.

```javascript
  const defaultColDef = useMemo( ()=> ( {
      sortable: true, 
      filter: true,
      cellRenderer: SimpleComp 
  }), []);
```

Cell renderers added to default column definition can be overridden by individual cells by setting the `cellRenderer` to `null`, or a different cell renderer e.g.

```javascript
    { field: 'athlete', cellRenderer: null },
```

## Cell Renderer Params

The example cell renderer has used the default parameters passed from the grid, it is also possible to pass addition params to the cell renderer like any React component.

If the cell render was changed as follows, the the value of the `buttonText` para would be shown as the button text rather than "@"

```javascript
const SimpleComp = p => {
    const onAt = useCallback( ()=> window.alert('At ' + p.value));
    return (
        <>
            <button onClick={onAt}>{p.buttonText}</button>
            {p.value}
        </>);
}
```

The param can be set in the column definition code as follows using the `cellRendererParams` property:

```javascript
  const [columnDefs, setColumnDefs] = useState([
        { 
            field: 'athlete', 
            cellRenderer: SimpleComp,
            cellRendererParams: {
                buttonText: '='
            }
        },
```

With the above configuration the button would display "=" rather than "@".

This allows the component to be re-used but have different rendering each time e.g.

```javascript
  const [columnDefs, setColumnDefs] = useState([
        { 
            field: 'athlete', 
            cellRenderer: SimpleComp,
            cellRendererParams: {
                buttonText: '='
            }
        },
        { 
            field: 'age', 
            cellRenderer: SimpleComp,
            cellRendererParams: {
                buttonText: '#'
            }
        },
```

The `athlete` cells would have a button showing "=" and the `age` cells would have a buttons showing "#" and both buttons would have the same functionality because they use the same cell renderer.

At this point our component has been outside the main grid definitions.

```javascript
const SimpleComp = p => {
    const onAt = useCallback( ()=> window.alert('At ' + p.value));
    return (
        <>
            <button onClick={onAt}>{p.buttonText}</button>
            {p.value}
        </>);
}

function App() {

  const gridRef = useRef();
  const [rowData, setRowData] = useState();
...  
```

It is also possible to inline the renderer alongside the column definition or create class components.

## Inline Components

For simple use-cases, or just for experimentation when developing, it is possible to inline the component in the column definition.

```javascript
 { field: 'age', cellRenderer: p => <><b>Age is: </b>{p.value}</> },
```

This will render **Age is:** (in bold) followed by the cell value.

e.g.

| Age |
|----|
| **Age is:** 23 |
| **Age is:** 19 |

## Class components

To create a class `Component` we will need to import `Component`

```javascript
import {useState, useRef, useEffect, useMemo, useCallback, Component} from 'react';
```

And then create a class that extends the component

```javascript
class PullComp extends Component {
  render() {
    return (
      <>
        <button onClick={ ()=> window.alert('Pull')}>Pull</button>
        {this.props.value}
      </>);
  }
}
```

This is added to the `country` column definition the same way as the earlier component.

```javascript
        { field: 'country', cellRenderer: PushComp },    
```

To keep the components consistent we'll rename the `SimpleComp` to `PushComp`

```javascript
const PushComp = p => {
  const onAt = useCallback( ()=> window.alert('Push'));
  return (
    <>
      <button onClick={onAt}>Push</button>
      {p.value}
    </>);
}
```

Then our column definitions are using a functional component, an inline component and a class component:

```javascript
  const [columnDefs, setColumnDefs] = useState([
        { field: 'athlete', cellRenderer: PushComp },
        { field: 'age', cellRenderer: p => <><b>Age is: </b>{p.value}</> },
        { field: 'country', cellRenderer: PushComp },
...         
```

## Cell Renderer Selector

If we wanted to make the component rendering dependent upon the data then we can do that using a cell renderer selector.

```javascript
    { field: 'year', 
        cellRendererSelector: p => {
        if (p.value==2000) {
            return {component: PushComp, params: {}};
        }
        if (p.value==2004) {
            return {component: PullComp};
        }
        }
    },
```

In the above code the `year` cell will render with a different component depending on the value of the cell data.

The `cellRendererSelector` is the function which determines which cell render to use.

The `component` is the reference to the chosen component.

And `params` is the optional mechanism for passing parameters into the chosen cell renderer component.

## Summary

In this Getting started with React Cell Renderers section you learned:

- what is a cell renderer
- creating a cell renderer inline, as a function and as a class
- using `cellRendererSelector` to conditionally choose a cell render
- what the params and `props` for a cell renderer are