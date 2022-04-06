# React Components Overview

Previous sections of this tutorial have shown some of the Custom AG Grid components in detail. To help solidify your understanding of components we will look at them from a general level, this will really help you understand how AG Grid works and make it easy to create any of the other components available.

https://www.ag-grid.com/react-data-grid/component-types/

## Video Tutorial

https://youtu.be/eglfpHRpcu0

00:00 Component Types Overview
00:27 Starting Code
00:38 Generic Component
01:52 Component Props
02:54 Custom Properties
03:30 Naming Pattern
04:13 Component Selectors
05:40 Class and JavaScript Components
08:05 Registering Components
09:28 Grid Provided Components
11:16 Grid Components
12:24 Enterprise components
14:25 Summary

## Source Code For This Section

The source code for this section is available in Github in the 'react-data-grid' repo and the subfolder `getting-started-video-tutorial/src/008-react-components`:

- https://github.com/ag-grid/react-data-grid/tree/main/getting-started-video-tutorial/src/008-react-components

## Starting Code

The basic code for `App.js` to start with, renders a grid and pulls information from the server.

```javascript
import './App.css';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {useState, useRef, useEffect, useMemo, useCallback} from 'react';

function App() {

  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
        { field: 'athlete' },
        { field: 'year'},
        { field: 'age'},
        { field: 'country' },
        { field: 'date' },
        { field: 'sport' },
        { field: 'gold' },
        { field: 'silver' },
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
      <AgGridReact rowData={rowData} columnDefs={columnDefs}
          animateRows={true}/>
    </div>
  );
}

export default App;
```

This really has no additional customisation.

## Generic Component

To demonstrate the similarity between components we will start by creating a very basic component and then we will use that in various places across the grid.

We'll create the component in `comps.js`, and we'll use this to store all the components we create in this section:

```javascript
export const HelloWorldComp = p => {
    return <>Hello World!!</>;
};
```

We can then import this component into `App.js` for use by the grid:

```javascript
import {HelloWorldComp} from './comps';
```

This component can be used in various ways, because the component isn't customisable it won't be a good example of each use case, but it will demonstrate the generic nature of components and how AG Grid handles them.

First we can add the component as a Cell Renderer, a Custom Filter and a Custom Header:

```javascript
        { field: 'athlete', cellRenderer: HelloWorldComp},
        { field: 'age', filter: HelloWorldComp},
        { field: 'country', headerComp: HelloWorldComp},
```

This will cause:

- every `athlete` cell to display "Hello World!!"
- the header of `country` column to display "Hello World!!"
- when the user clicks the filter of `age` column they will see "Hello World!!"

## Component Props

Each component will be treated as a normal React component and sent `props`. The object representing the `props` will be different depending on the use of the component i.e. a `cellRenderer` receives different `props` from a `filter`.

A simple way to experiment with the `props` available, without reading the documentation, is to print them to the console and see them in action.


```javascript
export const HelloWorldComp = p => {
    console.log(p);
    return <>Hello World!!</>;
};
```

This allows you to explore all the output values in the console when you interact with the grid.

The props for each component type can be found in the documentation for each component type and are documented as the IxParams interface e.g.

- `cellRenderer` uses the `ICellRendererParams`
    - https://www.ag-grid.com/react-data-grid/component-cell-renderer/
- `filter` uses the `IFilterReactComp`    
   - https://www.ag-grid.com/react-data-grid/component-filter/
- `headerComp` uses the `IHeaderParams`
- ag-grid.com/react-data-grid/component-header/

## Custom Properties

In addition to the grid supplied `props` it is also possible to pass in any custom properties we want. This is done using the _componentType_`Params` property in the column definition.

```javascript
export const HelloComp = p => {
    return <>Hello {p.name}!</>;
};
```

The `name` value can be configured in the column definition by using the associated `Params` property for each component type.

```javascript
        { 
          field: 'athlete', 
          cellRenderer: HelloComp,
          cellRendererParams: {name: 'Tom'}
        },
        { 
          field: 'age', 
          filter: HelloComp,
          filterParams: {name: 'Dick'},
        },
        { 
          field: 'country', 
          headerComponent: HelloComp,
          headerComponentParams: {name: 'Harry'}
        },
```

Remember to import the `HelloComp` into `App.js` for this to work.

```javascript
import {HelloComp} from './comps';
```


## Naming Pattern

The basic naming pattern for the properties is:

- `[key]` - component
- `[key]Params` - custom parameters passed to the component
- `[key]Selector` - a conditional way of choosing between components

So for a `cellRenderer` we have `cellRendererParams` and `cellRendererSelector`.

## Component Selectors

A Component Selector allows us to add some simple functionality to choose between components at run time.

Here is a simple example for a cell renderer. Based on the naming pattern we just explained, this would be a `cellRendererSelector`.

```javascript
        { 
          field: 'athlete', 
          // cellRenderer: HelloComp,
          cellRendererParams: {name: 'Tom'},
          cellRendererSelector: p => {
              return {
                  component: Math.random() > 0.5 ?
                    HelloComp : GoodbyeComp
              }
          }
        },    
```

The `cellRendererSelector` in the above example randomly returns either a `HelloComp` or a `GoodbyeComp`, the code for `GoodbyComp` is shown below.

Remember to remove or comment out the `cellRenderer` when using a `cellRendererSelector`.

The `cellRendererSelector` is passed props, these include the grid api, column definitions so it is possible to use all the information in the row, column, cell or grid to support any decision process required.

```javascript
export const GoodbyeComp = p => {
    return <>Goodbye {p.name}!</>;
};
```

More detailed documentation can be found online:

https://www.ag-grid.com/react-data-grid/components/

`Selector`s are only documented for `cellRenderer` and `cellEditor`.


## Class Components

Currently we have seen React functional components:

```javascript
export const HelloComp = p => {
    return <>Hello {p.name}!</>;
};
```

It is also possible to use class components.

To do that we would have to import the `Component` from `React`:

```javascript
import {Component} from 'react';
```

And amend the previous `GoodbyeComp` to be a class component:

```javascript
export class GoodbyeComp extends Component {
    render() {
        return <>Goodbye {this.props.name}!</>;
    }
}
```

## JavaScript Components

JavaScript components make it possible for different teams in an organisation to share custom components for AG Grid across the different frameworks that AG Grid supports.

AG Grid has a 100% React Rendering Engine when used with React. AG Grid also has framework specific rendering engines for Vue, Angular and Vanilla JavaScript.

JavaScript components can be shared between teams and use no matter which framework rendering engine is being used.

To create a JavaScript Component we have to implement the methods for an AG Grid component interface:

```javascript
export class GreetJSComp {
    init(p) {
        this.eGui = document.createElement('span');
        this.eGui.innerHTML = 'GreetJS ' + p.name;
    }
    getGui() {
        return this.eGui;
    }
}
```

## Different Components

It doesn't matter if the component is function based, class based or JavaScript based, they are all added to the column definitions in the same way:

```javascript
        { 
          field: 'athlete', 
          cellRenderer: HelloComp,
          cellRendererParams: {name: 'Tom'},
        },
        { 
          field: 'age', 
          filter: GoodbyeComp,
          filterParams: {name: 'Dick'},
        },
        { 
          field: 'country', 
          headerComponent: GreetJSComp,
          headerComponentParams: {name: 'Harry'}
        }, 
```

## Registering Components

Components can be defined in a column definition by a symbolic key if we register the components with the grid first.

In the `App.js`:

```javascript
  const components = useMemo( ()=> ({
    aaa: HelloComp,
    bbb: GoodbyeComp
  }), []);
```

Then register the component mapping with the grid in the grid definition:

```javascript
return (
<div className="ag-theme-alpine" style={{height: '100%'}}>
    <AgGridReact ref={gridRef}
        components={components}
        rowData={rowData} animateRows={true} 
        columnDefs={columnDefs}
        />
</div>
```

It is then possible to refer to a component using the mapping:

```javascript
        { 
        field: 'age', 
        cellRenderer: 'aaa',
        cellRendererParams: {name: 'Mick'},
        filter: HelloComp,
        filterParams: {name: 'Dick'},
    },
```

The `cellRenderer` is provided with the String `'aaa'` which maps on to a `HelloComp` so the `HelloComp` would be used as a `cellRenderer` for the `age` column.

Referencing by name from a set of registered component mappings often makes it easier to configure the grid more easily through JSON or other data driven configuration approaches.

## Grid Provided Components

The grid comes with some pre-registered components. These all use the namespace `ag` to reduce conflict with your own components. e.g. `agDateInput`, `agColumnHeader`.

These components are all listed in the documentation:

https://www.ag-grid.com/react-data-grid/components/#grid-provided-components

As an example, we could use the `agNumberColumnFilter` as follows:

```javascript
        { 
          field: 'age', 
          cellRenderer: 'bbb',
          cellRendererParams: {name: 'Mick'},
          filter: 'agNumberColumnFilter',
          filterParams: {name: 'Dick'},
        },
```

All built in components would be reference by String value.

## Grid Components

All the examples above have been column based custom components.

The grid also has customisable components which are configured on the grid definition.

- No Rows Overlay component
- Loading Overlay Component

### No Rows Overlay component

When the grid has no rows to show, it uses an overlay to hide the grid rows.

```javascript
  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(result => result.json())
    .then(rowData => setRowData([]]))
  }, []);
```

You would see the default "No Rows To Show" overlay when the row data is set to an empty array.

This can be configured using a `noRowsOverlayComponent` and the configuration is made using grid properties:

```javascript
      <AgGridReact ref={gridRef}

          noRowsOverlayComponent={HelloComp}
          noRowsOverlayComponentParams=
                  {{name: 'Susan No Rows'}}
```

### Loading Overlay Component

When the grid row data is `undefined` then the `Loading...` overlay is shown:


```javascript
//   useEffect(() => {
//     fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
//     .then(result => result.json())
//     .then(rowData => setRowData([]]))
//   }, []);
```

This can be customised with a `loadingOverlayComponent`.

```javascript
          loadingOverlayComponent={GoodbyeComp}
          loadingOverlayComponentParams=
                  {{name: 'Rachel Loading'}}
```

## Enterprise Grid Components

The Enterprise version of AG Grid has two additional components that can be customized.

You can see how to configure and work with the Enterprise version in the earlier "Enterprise Overview" section.

Summary:

- `npm install --save ag-grid-enterprise`
- in `App.js` add `import 'ag-grid-enterprise';`

The two components are:

- Status Bar Panels
- Sidebar Tool Panels


### Status Bar Panels

The status bar is shown below the grid.

```javascript
          statusBar={{
            statusPanels: [
              {
                statusPanel: HelloComp,
                statusPanelParams: {name: 'Peter'},
              },
              {
                statusPanel: GoodbyeComp,
                statusPanelParams: {name: 'Paul'},
              }
            ]
          }}
```

### Sidebar Tool Panels

The sidebar allows you to have custom tabbed pop out panels on the right hand side of the screen.

```javascript
          sideBar={{
            toolPanels: [
              {
                id: '3',
                labelDefault: 'Columns',
                toolPanel: 'agColumnsToolPanel',
              },
              {
                id: '1',
                labelDefault: 'Custom 1',
                toolPanel: HelloComp,
                toolPanelParams: {name: 'Summer'}
              },
              {
                id: '2',
                labelDefault: 'Custom 2',
                toolPanel: GoodbyeComp,
                toolPanelParams: {name: 'Winter'}
              }
            ]
          }}
```

## Summary

You should now have a good generic overview of how components work. The nuances of each can be found in the documentation.

https://www.ag-grid.com/react-data-grid/components/