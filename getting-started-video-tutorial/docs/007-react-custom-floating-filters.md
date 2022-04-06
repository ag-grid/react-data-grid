
# Custom Floating Filters

The Floating filters can be customised. The floating filters use the underlying filter for the column and add a layer of rendering and editing to make filtering easier for the user.

https://www.ag-grid.com/react-data-grid/component-floating-filter/

## Video Tutorial

https://youtu.be/CxwfX4KodaM

00:00 starting from custom filters
01:00 floating filter basics
01:40 Floating Filter Component
02:25 Accessing Filter Models
03:50 Changing Filter Models
05:15 Floating Filter Responsibilities
05:58 props for Floating Filter
06:45 using filterParams
08:45 Life-cycle of a Floating Filter
10:06 Re-using Floating Filters
10:30 Summary

## Source Code For This Section

The source code for this section is available in Github in the 'react-data-grid' repo and the subfolder `getting-started-video-tutorial/src/007-react-custom-floating-filters`:

- https://github.com/ag-grid/react-data-grid/tree/main/getting-started-video-tutorial/src/007-react-custom-floating-filters

## Starting Code

The code we are starting from has a basic data grid that reads data from a server, as shown in `App.js` below:

```javascript
import './App.css';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {useState, useRef, useEffect, useMemo, useCallback} from 'react';

import ValuesFilter from './valuesFilter';
import ValuesFloatingFilter from './valuesFloatingFilter';

function App() {

  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
        { field: 'athlete' },
        { field: 'year', 
              filter: ValuesFilter,
              filterParams: {
                values: [2000,2004]
              }
          },
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

This application has a custom filter which is being used on the `year` field:

```javascript
        { field: 'year', 
              filter: ValuesFilter,
              filterParams: {
                values: [2000,2004]
              }
        },
```

A floating filter builds on the custom filter to provide an easy way to control or display the filter.

The custom filter itself is contained in `valuesFilter.js`. This was explained in the React Custom Filters section of this tutorial.

```javascript

import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from 'react';

export default forwardRef( (props, ref) => {

    const [filterState, setFilterState] = useState('off');

    useImperativeHandle(ref, ()=> {
        return {
            isFilterActive() {
                return filterState!='off';
            },
            doesFilterPass(params) {
                const field = props.colDef.field;
                return params.data[field] == filterState;
            },
            getModel() {
                if (filterState=='off') { 
                    return undefined;
                }
                return {
                    state: filterState
                }
            },
            setModel(model) {
                if (model==null) {
                    setFilterState('off');
                } else {
                    setFilterState(model.state);
                }
            }
        };
    });

    useEffect( ()=> props.filterChangedCallback(), 
                [filterState]);

    return (
        <>
            <div className='filter-state'>
                State = {filterState}
            </div>
            <div className='filter-entry'>
                <button 
                    onClick={()=>setFilterState('off')}>
                        Off
                </button>
            </div>
            { props.values.map( value => (
                <div key={value} className='filter-entry'>
                    <button 
                        onClick={()=>setFilterState(value)}>
                            {value}
                    </button>
                </div>
            )) }
        </>
    );
});
```

## Floating Filter Basics

Floating filters build on custom filters.

To enable Floating filters we add the `floatingFilter` property to the appropriate column definitions:

```javascript
        { field: 'year', 
              filter: ValuesFilter,
              filterParams: {
                values: [2000,2004]
              },
              floatingFilter: true
          },
```

Setting the `floatingFilter` to true uses the default read only floating filter, where the value shows is the string representation of the filter model returned by the custom filter.

In the starting point code, no function has been created to render the model as a String so initially it will be blank, no matter which filter is set on the column.

To rectify this we add a `getModelAsString` function to the custom filter which returns the filter model as a String.

```javascript
            getModelAsString() {
                return filterState=='off' ?
                        '' : filterState;
            },
```

This would be added to the `valuesFilter.js` component e.g.

```javascript
    useImperativeHandle(ref, ()=> {
        return {
            isFilterActive() {
                return filterState!='off';
            },
            getModelAsString() {
                return filterState=='off' ?
                        '' : filterState;
            },
```

With this code in place, the default read only floating filter would show the value of the `filterState` variable.

Rather than use `getModelAsString` we can create our own React components to render as the floating filter.

## Floating Filter Component

Using a component as a custom floating filter means that we have full control over the data rendered and can offer additional functionality to help the user filter and work with the data in the grid.

We'll start by creating a simple custom filter in a new file called `valuesFloatingFilter.js` and it will render some static text to start with:

```javascript
import React from `react`;

export default props =>{
    return (<>Hello World!!!</>);
}
```

Then we configure the column definition to use this component instead of the default read only renderer.

```javascript
        { field: 'year', 
              filter: ValuesFilter,
              filterParams: {
                values: [2000,2004]
              },
              floatingFilter: true,
              floatingFilterComponent: ValuesFloatingFilter
          },
```

The `floatingFilterComponent` property specifies the component to use as the `floatingFilter`. Note that `floatingFilter: true` still needs to be set, otherwise the `floatingFilter` will not be displayed.

We need to remember to import the filter component into `App.js`.

```javascript
import ValuesFloatingFilter from './valuesFloatingFilter';
```

## Accessing Filter Models

The underlying custom filter has a filter model with custom data and functions. We can access this in the custom floating filter when we amend the floating filter component as follows:

```javascript
import React, {forwardRef, useImperativeHandle} from 'react';

export default forwardRef( (props, ref) => {

    useImperativeHandle(ref, ()=> {
        return {
            onParentModelChanged(parentModel) {
                console.log('onParentModelChanged',parentModel);
            }
        };
    });

    return(<>Hello World!!!</>);
```

The above code does not change the external appearance of the floating filter, but we have now implemented the interface that allows the grid to communicate with the floating filter.

`forwardRef` and `useImperativeHandle` alow the grid to communicate to the component.

We implement the `onParentModelChanged` interface as the grid will call this method when the underlying custom filter model changes i.e. when someone changes the value of the filter.

The `parentModel` object is the same object that is returned by the `getModel` function in the custom filter.

Rather than writing the model out to the console, which is useful for debugging and learning the various properties of the AG Grid API, we can render the filter state as the custom filter.

```javascript
import React, {forwardRef, useImperativeHandle, useState} from 'react';

export default forwardRef( (props, ref) => {

    const [value, setValue] = useState();

    useImperativeHandle(ref, ()=> {
        return {
            onParentModelChanged(parentModel) {
                if(parentModel){
                    setValue(parentModel.state);
                }else{
                    setValue();
                }
            }
        };
    });

    return(<>{value}</>);
```

The Custom Floating Filter component now maintains a state, which is the value of the underlying filter component, and renders this as the floating filter.

Learn more in the documentation:

https://www.ag-grid.com/react-data-grid/component-floating-filter/#custom-floating-filter-interface-2

## Changing Filter Models

The floating filter is not limited to rendering the underlying custom filter values, it can also amend the underlying filter. This allows the Custom Floating Filter component to offer an alternative GUI to set the filter for a column.

To demonstrate this we will create a single button as the custom filter, and when pushed it will set the filter to a hard coded default value:

```javascript

    const myListener = useCallback(()=>{
        props.parentFilterInstance( instance=>{
            instance.setValue(2000);
        }, []);
    }, []);

    return(
        <>
            <button onClick={myListener}>Push</button>
            {value}
        </>
        );
```

`parentFilterInstance` is a function exposed on the `prop` which we can use in a callback to access the `instance` of the parent custom filter.

We have full access to the `instance` which is the object of the parent custom filter API returned in the `useImperativeHandle` code and can access any of the API functions e.g. `isFilterActive`, `getModel`, `setModel`.

In this case we are using a `setValue` method, so we would need to write the `setValue` method in the `valuesFilter.js`

```javascript
    useImperativeHandle(ref, ()=> {
        return {
            setValue(value) {
                setFilterState(value);
            },
```

This `setValue` method allows us to change the state of the filter and set a new filter on the column.

## Floating Filter Responsibilities

The main filter `ValuesFilter` represented in `valuesFilter.js` and configured on the column as the `filter`, is the object that holds the filter state and implements the custom filtering logic. The grid uses this to know if the filter has changed. It also controls the internal representation model for the filter state.

```javascript
        { field: 'year', 
              filter: ValuesFilter,
```

The floating filter has fewer responsibilities. It is another way of representing the filter state to the user on the GUI and can present an alternative GUI to the user for changing the filter. All changes to the filter are carried out by the parent filter through the exposed API returned by the parent filter.

## Props for Floating Filter

The props passed into the floating filter offer a lot of flexibility.

We have access to the:

- `api` which is the full Grid API if we want to create a very flexible filter.
- `column` which is an object representing the full details of the column the filter is attached to.
- `currentParentModel` is a function to access the parent filter model.
- `parentFilterInstance` is a function to access the parent filter API.
- `filterParams` are the props passed into the parent filter.
- `showParentFilter` can be used to display the pop up for the parent filter.
- `suppressFilterButton` tells us if we have configured the parent filter button to display or not.

The props for the Floating Filter are fully documented in the online documentation:

https://www.ag-grid.com/react-data-grid/component-floating-filter/#custom-filter-parameters-2

## Using filterParams

`filterParams` are the props passed into the parent filter, this gives us access to all the information that was used to configure the parent filter, allowing us to fully create an alternative filter GUI with no limitations.

In our example code, the parent filter was configured with `filterParams` to configure the filter dynamically.

```javascript
        { field: 'year', 
              filter: ValuesFilter,
              filterParams: {
                values: [2000,2004]
              },
```

Using the `filterParams` on our floating filter `props` gives us access to those values in our custom floating filter.

```javascript
const allValues = props.filterParams.values;
```

We can then use those values in our custom filter GUI to render the values as a series of buttons to control the filter, and we can see the value of the filter which as been set.

```javascript
    return(
        <div>
            <div>
                <button onClick={()=>clickListener('off')}>
                    Off
                </button>
                </div>
                { allValues.map(
                    value =>
                        <button key={value} onClick={()=>clickListener(value)}>
                            {value}
                        </button>
                ) }
            </div>
            <div>{value}</div>
        </div>
    );
```

The earlier `myListener` is renamed to `clickListener` because it now covers multiple buttons and the `value` is passed in and used to set the value of the parent filter.

```javascript
    const myListener = useCallback( value =>{
        props.parentFilterInstance( instance=>{
            instance.setValue(value);
        }, []);
    }, []);
```


## Life-cycle of a Floating Filter

We can visually see the life-cyle of a floating filter by writing to the console when a floating filter is created and when it is destroyed.

This can be done by using a `useEffect` for mounting the component with a returned callback for when the filter is unmounted.

```javascript
    useEffect( ()=> {
        console.log('Floating Filter Created');
        return ()=> console.log('Floating Filter Destroyed');
    }, []);
```

With this code added to the component we would see that:

- the floating filter is created as soon as the grid is drawn
- if the column is not visible, then the floating filter is destroyed, this is due to the DOM virtualisation to only render what is necessary
- as soon as the column is brought back into view the floating filter is re-created

Custom Floating filters are created when the column is visible and destroyed when the column is not visible. This is a marked difference to the Custom Filters, these are created when displayed for the first time, but remain even when not visible because the state from that component is used to control the filtering on the data grid and the filter can still be active even if you can't see the filter GUI.

## Re-using Floating Filters

In the same way that Custom Filter and other components can be re-used, the Custom Floating Filters can be re-used and applied to other columns.

For example, we could additionally configure the `age` column to use the `ValuesFilter` and `ValuesFloatingFilter`.

```javascript
        { field: 'age', 
              filter: ValuesFilter,
              filterParams: {
                values: [18, 19]
              },
              floatingFilter: true,
              floatingFilterComponent: ValuesFloatingFilter
        },
```

## Summary

Floating Filters can be customised to provide an alternative way of visualising the column filter state and an alternative GUI for the filter.

The don't maintain the filter state, they are simply a rendering mechanism so the component is created when visible and destroyed when not visible.

Full documentation is available online:

https://www.ag-grid.com/react-data-grid/component-floating-filter/