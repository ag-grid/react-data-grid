
# QuickStart Project Setup

In this section you'll learn how to create a project, add AG Grid. You'll understand what CSS is used to style and structure the grid. How to use state and effect to manage data in the grid while loading data from the server. Sorting and Filtering is demonstrated through specific and default column properties. Grid Properties are used to animate rows and support selection. Adding functionality to the grid can be implemented by hooking into the grid events and using the API.

## Quick Start Guide Video

This video is a quick start tutorial to getting started with AG Grid in a React project. Niall Crosby, the CEO and creator of AG Grid walks you through the basic knowledge needed to work with AG Grid using React. 

https://youtu.be/Pr__B6HM_s4

- 00:00 Create a Project
- 00:30 Get Started
- 01:05 Create an AG Grid
- 02:05 CSS Includes Explained
- 03:11 Using React State
- 03:29 Loading data from server with useEffect
- 03:55 Sorting and Filtering Columns
- 04:35 Default Column Definitions
- 04:55 Grid properties to animate and select rows
- 05:33 hooking into Grid Events
- 06:00 using the Grid API
- 06:42 Summary
- 07:03 Outro

## Source Code For This Section

The source code for this section is available in Github in the 'react-data-grid' repo and the subfolder `getting-started-video-tutorial/src/001-quickstart-guide/`:

- https://github.com/ag-grid/react-data-grid/tree/main/getting-started-video-tutorial/src/001-quickstart-guide


## Create a Project

Create a project:

```
npx create-react-app hello
```

```
cd hello
```

Install AG Grid

```
npm install --save ag-grid-community ag-grid-react
```

- ag-grid-community
    - the community edition of AG Grid
- ag-grid-react
    - the React Rendering Engine

`--save` will update the `package.json` file


Start the project with:

```
npm run start
```

## Render aa Simple Grid

Change the `App.js` file:


```javascript
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

function App(){
   const [rowData] = [
       {make: "Toyota", model: "Celica", price: 35000},
       {make: "Ford", model: "Mondeo", price: 32000},
       {make: "Porsche", model: "Boxter", price: 72000}
   ];
   
   const [columnDefs] = [
       { field: 'make' },
       { field: 'model' },
       { field: 'price' }
   ];

   return (
       <div className="ag-theme-alpine" style={{height: 500, width: 500}}>
           <AgGridReact
               rowData={rowData}
               columnDefs={columnDefs}>
           </AgGridReact>
       </div>
   );
}

export default App;
```

Notes:

- `ag-grid.css` is the structural CSS
- `ag-theme-alpine.css` is the styling CSS
- Make sure to give the grid a width and height
   -  `style={{height: 500, width: 500}}`
- Column Definitions define the column properties
- rowData is the data to render
- the data and column definitions are applied to the Grid as properties

## Reactify it with useState

Adding the data as state allows it to be changed easily.

```javascript
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {useState} from 'react';


function App(){
   const [rowData, setRowData] = useState([
       {make: "Toyota", model: "Celica", price: 35000},
       {make: "Ford", model: "Mondeo", price: 32000},
       {make: "Porsche", model: "Boxter", price: 72000}
   ]);
   
   const [columnDefs, setColumnDefs] = useState([
       { field: 'make' },
       { field: 'model' },
       { field: 'price' }
   ]);

   return (
       <div className="ag-theme-alpine" style={{height: 500, width: 500}}>
           <AgGridReact
               rowData={rowData}
               columnDefs={columnDefs}>
           </AgGridReact>
       </div>
   );
}

export default App;
```

## Load Data From Server

Add a `useEffect` to load data from a url

```javascript
   useEffect(() => {
       fetch('https://www.ag-grid.com/example-assets/row-data.json')
           .then(result => result.json())
           .then(rowData => setRowData(rowData))
   }, []);
```

Adding this means we no longer need to create default state for `rowData`, remember to add `useEffect` to the react imports:

```javascript
import {useState, useEffect} from 'react';
```

Leading to the final code:

```javascript
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {useState, useEffect} from 'react';


function App(){
   const [rowData, setRowData] = useState();
   
   const [columnDefs, setColumnDefs] = useState([
       { field: 'make' },
       { field: 'model' },
       { field: 'price' }
   ]);

   useEffect(() => {
       fetch('https://www.ag-grid.com/example-assets/row-data.json')
           .then(result => result.json())
           .then(rowData => setRowData(rowData))
   }, []);

   return (
       <div className="ag-theme-alpine" style={{height: 500, width: 500}}>
           <AgGridReact
               rowData={rowData}
               columnDefs={columnDefs}>
           </AgGridReact>
       </div>
   );
}

export default App;
```

## Sorting and Filtering

Add Sorting and Filtering to a column with column properties:

```javascript
   const [columnDefs, setColumnDefs] = useState([
       { field: 'make', sortable: true, filter: true },
       { field: 'model' },
       { field: 'price' }
   ]);
```

Above code makes the 'make' column sortable and filterable with a text filter.

Column properties are documented in the documentation:

https://www.ag-grid.com/react-data-grid/column-properties/

## Default Column Definitions

Default column definitions create a set of properties to be added to every column.

```javascript
const defaultColDef = useMemo( ()=> (
    {
        sortable: true,
        filter: true
    }
))
```

Note: because this won't change, it has been memoized.

There is no longer any need to have sortable and filter properties on the column definitions.

```javascript
   const [columnDefs, setColumnDefs] = useState([
       { field: 'make' },
       { field: 'model' },
       { field: 'price' }
   ]);
```

We do have to add the default Column Definitions to the grid properties:

```javascript
           <AgGridReact
               rowData={rowData}
               columnDefs={columnDefs}>
               defaultColDef={defaultColDef}
           </AgGridReact>
```

And remember to add `useMemo` to the react imports.

```javascript
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {useState, useEffect, useMemo} from 'react';


function App(){
   const [rowData, setRowData] = useState();
   
   const [columnDefs, setColumnDefs] = useState([
       { field: 'make' },
       { field: 'model' },
       { field: 'price' }
   ]);

   useEffect(() => {
       fetch('https://www.ag-grid.com/example-assets/row-data.json')
           .then(result => result.json())
           .then(rowData => setRowData(rowData))
   }, []);

   return (
       <div className="ag-theme-alpine" style={{height: 500, width: 500}}>
           <AgGridReact
               rowData={rowData}
               columnDefs={columnDefs}>
               defaultColDef={defaultColDef}
           </AgGridReact>
       </div>
   );
}

export default App;
```

## Grid Properties

Two useful Grid properties:

- `animateRows` to animate rows when sorting
- `rowSelection` to make rows selectable

```javascript
          <AgGridReact
               rowData={rowData}
               columnDefs={columnDefs}>
               animateRows={true}
               rowSelection='multiple'
               defaultColDef={defaultColDef}
           </AgGridReact>
```

Grid properties are documented in the documentation:

https://www.ag-grid.com/react-data-grid/grid-properties/

## Listening to Grid Events

Create a listener:

```javascript
const cellClickedListener = useCallback(event => {
    console.log('cellClicked', event);
}, []);
```

This has been wrapped in a callback hook to create a memoized version.

The listener is then bound to the grid with a grid property:

```
onCellClicked={cellClickedListener}
```

To setup the grid as follows:

```javascript
          <AgGridReact
               rowData={rowData}
               columnDefs={columnDefs}>
               animateRows={true}
               rowSelection='multiple'
               defaultColDef={defaultColDef}
               onCellClicked={cellClickedListener}
           </AgGridReact>
```

Remember to add `useCallback` to the imports:

```javascript
import {useState, useEffect, useMemo, useCallback} from 'react';
```

## Using the API

The grid has an internal API which we can use programmatically, in this example we will add it as a reference using `useRef`.

```javascript
import {useState, useEffect, useMemo, useCallback, useRef} from 'react';
```

And store it in a const:

```javascript
const gridRef = useRef();
```

Allocating it to a Grid property:

```javascript
          <AgGridReact
               ref={gridRef}
               rowData={rowData}
               columnDefs={columnDefs}>
               animateRows={true}
               rowSelection='multiple'
               defaultColDef={defaultColDef}
               onCellClicked={cellClickedListener}
           </AgGridReact>
```

We can use `gridRef` in code to call the API, e.g. from a button click:

```javascript
const buttonListener = useCallback( e =>{
    gridRef.current.api.deselectAll();
}, []);
```

And make sure the button appears in the HTML:

```javascript
   return (
       <div>
            <button onClick={buttonListener}>Push Me</button>
            <div className="ag-theme-alpine" style={{height: 500, width: 500}}>
                <AgGridReact
                    ...
                </AgGridReact>
            </div>
        </div>            
   );
```

When the button is pressed, any selected items in the grid will be deselected.

Documentation for the Grid API is online:

https://www.ag-grid.com/react-data-grid/grid-api/

## Summary

This is an overview of key points for working with AG Grid:

- creating and styling a grid
- configuring columns and using default Column Definitions
- configuring the grid with grid properties
- changing data in the grid and loading data from JSON
- listening to grid events
- working with the grid api