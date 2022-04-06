
# React Custom Filters

The default filters provided by AG Grid can be customised both in terms of the GUI and the underlying logic to filter the items.

https://www.ag-grid.com/react-data-grid/filter-custom/

## Video Tutorial

https://youtu.be/yO3_nTyDv6o

00:00 creating custom filters
01:24 API Interface
02:24 Creating the GUI
02:50 Implementing Filtering
04:06 Filtering with Options
05:58 Using filterParams and props
07:38 Make Filter GUI Configurable
09:05 Filter Models
11:14 getModelAsString
13:08 onNewRowsLoaded
13:32 onAnyFilterChanged
14:05 destroy
15:06 afterGuiAttached
15:31 App calling filter
17:10 Summary

## Source Code For This Section

The source code for this section is available in Github in the 'react-data-grid' repo and the subfolder `getting-started-video-tutorial/src/006-react-custom-filters`:

- https://github.com/ag-grid/react-data-grid/tree/main/getting-started-video-tutorial/src/006-react-custom-filters

## Starting Point

The starting code is a simple grid which renders data from a server, as shown by the `App.js` below:

```javascript
import './App.css';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import 'ag-grid-enterprise';
import {useState, useRef, useEffect, useMemo, useCallback} from 'react';

function App() {

  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
        { field: 'athlete' },
        { field: 'year' },
        { field: 'age' },
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
        <AgGridReact ref={gridRef}
            rowData={rowData} animateRows={true} 
            columnDefs={columnDefs} defaultColDef={defaultColDef}          
            />
      </div>
  );
}

export default App;
```

## Default Filter

As a reminder, a default text filter can be applied to a column definition by configuring the `filter` property:

```javascript
        { field: 'year', filter: true },
```

We can replace both the GUI and the filtering logic by creating a custom filter.

## Custom Filter

We can create a custom component in a separate file then using it in `App.js`

A simple functional filter component would be the following code in a file called `YearFilter.js`:

```javascript
import React from 'react';

export default p =>{
    return(<>Hello World!!!</>);
}
```

We can then import that into our `App.js`

```javascript
import YearFilter from './YearFilter';
```

Then configure the `year` column to use this filter.

```javascript
        { field: 'year', filter: YearFilter },
```

The filter on the `year` column would now display the text "Hwllo World!!!", this is not very usable, but it is a good start to see how easy it is to configure the AG Grid GUI, the next action is to then make it do something.

## Functional Custom Filter

The component needs to be able to answer questions that the grid asks like:

- Is the filter active?
- Does this row pass the active filter?


### API Interface

To do this the filter implements an interface that the grid can use.

In react functional components we do this by creating forward refs and using the imperative handle.


```javascript
import React, {forwardRef, useImperativeHandle} from 'react';

export default forwardRef( (props, ref) =>{

    useImperativeHandle(ref, ()=> {
            isFilterActive() {
                return false;
            },
            doesFilterPass(params) {
                return false;
            },
            getModel() {
                return undefined;                
            },
            setModel(model) {
            }
    });

    return(<>Hello World!!!</>);
});
```

The four mandatory methods for a filter are:

- `isFilterActive`
    - if this returns true then the filter is active
- `doesFilterPass`
    - if the filter is active then `doesFilterPass` is called for each row in the grid and it returns false if the row should be filtered and not displayed, true means the row will be displayed as it passes the filter.
- `getModel`
    - used when the Api get model is used.
- `setModel`
    - used when the Api set model is used.

The above code creates the internal API interface, now we need to create the GUI for the user.

The full documentation for the custom filter interface is online:

- https://ag-grid.com/react-data-grid/component-filter/#custom-filter-interface-2

### Creating the GUI

```javascript
    return(
        <>
            <div>Year filter</div>
            <label>
                Filter On
                <input type='radio' name='rbYearFilter'
                       onChange={offListener}
                       checked={filterState=='off'}></input>
            </label>
            <label>
                Filter Off
                <input type='radio' name='rbYearFilter'
                       onChange={onListener}
                       checked={filterState=='on'}></input>
            </label>

        </>
    );
```

To make this work we have to use an internal state for the `filterState`:

```javascript
    const [filterState, setFilterState] = useState('off');
```

And add the listener callbacks to set the state when the buttons are clicked.

```javascript
    const onListener = useCallback|(
                ()=> setFilterState('on'), []);
    const offListener = useCallback(
                ()=> setFilterState('off'), []);
```

This will create a filter drop down that has a set of radio buttons to switch the filter on and off. Currently the filter does not apply because it is never active, the `isFilterActive` function always returns `false`.

### Implementing Filtering

The GUI changes the state in the component. We can now implement the API methods to actually filter the grid.

The filter is active when the 'Filter On' radio button has been selected and the `filterState` is `on`:

```javascript
            isFilterActive() {
                return filterState=='on';
            },
```

If we leave the `doesFilterPass` returning `false` then we will see the filter works by filtering everything out.

```javascript
            doesFilterPass(params) {
                return false;
            },
```

We also have to inform the grid that the filter has changed, which we do when the `filterState` changes, and we call the `filterChangedCallback` function on the `props` passed through from the grid.

```javascript
    useEffect( ()=> props.filterChangedCallback(), 
                [filterState]);
```

In this current form, the filter can be switched on and off and rows will be displayed or not.


```javascript
import React, {forwardRef, useCallback, useEffect, useImperativeHandle} from 'react';

export default forwardRef( (props, ref) =>{

    const [filterState, setFilterState] = useState('off');

    useImperativeHandle(ref, ()=> {
            isFilterActive() {
                return filterState=='on';
            },
            doesFilterPass(params) {
                return false;
            },
            getModel() {
                return undefined;                
            },
            setModel(model) {
            }
    });

    const onListener = useCallback|(
                ()=> setFilterState('on'), []);
    const offListener = useCallback(
                ()=> setFilterState('off'), []);

    useEffect( ()=> props.filterChangedCallback(), 
                [filterState]);

    return(
        <>
            <div>Year filter</div>
            <label>
                Filter On
                <input type='radio' name='rbYearFilter'
                       onChange={offListener}
                       checked={filterState=='off'}></input>
            </label>
            <label>
                Filter Off
                <input type='radio' name='rbYearFilter'
                       onChange={onListener}
                       checked={filterState=='on'}></input>
            </label>

        </>
    );
});
```

### Filtering with Options

Currently the filter is just on, or off, so we will amend the GUI to have options and then filter when those particular options have been chosen.

This time we will make the `filterState` match the chosen options, and simple set the filter state when the option is chosen, rather than wrap it in a callback.

```javascript
    return(
        <>
            <div>Year filter</div>
            <label>
                Filter Off
                <input type='radio' name='rbYearFilter'
                       onChange={()=>setFilterState('off')}
                       checked={filterState=='off'}></input>
            </label>            
            <label>
                2004
                <input type='radio' name='rbYearFilter'
                       onChange={()=>setFilterState(2004)}
                       checked={filterState=='2004'}></input>
            </label>
            <label>
                2008
                <input type='radio' name='rbYearFilter'
                       onChange={()=>setFilterState(2008)}
                       checked={filterState=='2008'}></input>
            </label>

        </>
    );
```

We cam now delete the callback code:

```javascript
    const onListener = useCallback|(
                ()=> setFilterState('on'), []);
    const offListener = useCallback(
                ()=> setFilterState('off'), []);
```

And make the filter condition to be 'not on'.

```javascript
            isFilterActive() {
                return filterState!='off';
            },
```

It is finally time to implement some filtering condition, because we store the actual filter value in the filterState we can compare it with the value of the field.

```javascript
            doesFilterPass(params) {
                return params.data.year == filterState;
            },
```

This will create a working filter with three choices: off, 2004, 2008.

The `params` passed into `doesFilterPass` makes it possible to compare the values in the grid with the filter, and params gives us access to the full data in the row.

The `props` passed into the component gives us access to the api, column definitions and the callbacks required to implement a complete custom filter.

The documentation for `props` is online:

- https://ag-grid.com/react-data-grid/component-filter/#custom-filter-parameters-2

### Using `filterParams` as Props to Configure Filter

Currently the filter is hard coded to work with the `year` column, we can use the `props` to configure the filter to make it more flexible and re-usable.

To start with we can configure the title displayed for the filter, first pass in the title we want to render.

In `App.js` when we configure the filter we can add some `filterParams` which become the `props` for the filter component.

```javascript
        { field: 'year', 
            filter: YearFilter,
            filterParams: {
                title: 'My Custom Filter'
            }
        },
```

Then we can use the `filterParams` as `props`.

```javascript
    return(
        <>
            <div>{props.title}}</div>
```

### `doesFilterPass` params

The function `params` passed through to `doesFilterPass` contains the data and the RowNode, we can use this to implement any complex filtering operation.

Rather than hard code the field name:

```javascript
            doesFilterPass(params) {
                return params.data.year == filterState;
            },
```

We can pull the field information from the props and compare to the params.

```javascript
            doesFilterPass(params) {
                const field = props.colDef.field;
                return params.data[field] == filterState;
            },
```

This now makes the filter work on any field, with only the filter values in the GUI being hard coded.

### Make Filter GUI Configurable

We can add class names to make the styling more configurable later.

One entry, to switch the filter off has been hard coded, but the remainder of the options will be passed in as an array named 'values' in the `props` (`filterParams` in `App.js`)

```javascript
    return(
        <>
            <div className='filter-title'>{props.title}</div>
            <div classNAme='filter-state'>
                State = {filterState}
            </div>
            <div className='filter-entry'>
                <button
                    onClick={()=>setFilterState('off')}>
                    Off
                </button>
            </div>
            { props.values.map( value =>(
                <div className='filter-entry'>
                    <button key={value}
                        onClick={()=>setFilterState(value)}>
                        {value}
                    </button>
                </div>
            ))}
        </>
    );
```



The filter can now be used on multiple columns so we should probably import it with a more generic name:

```javascript
import MyFilter from './YearFilter';
```

Now we can configure the filter from the `App.js` column definitions:

```javascript
        { field: 'year', 
            filter: MyFilter,
            filterParams: {
                title: 'My Custom Filter',
                values: [2000,2004,2006]
            }
        },
        { field: 'age', 
            filter: MyFilter,
            filterParams: {
                title: 'Age Filter',
                values: [18,19,20,21]
            },
        },
```

This creates a filter on the `year` column with the values: 2000, 2004, and 2006.

Also a filter on the `age` column with the values: 18,19,20 and 21.

## Filter Models

Filter models allow us to save and restore filter state.

```javascript
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
            },
```

The grid calls `getModel` when it wants to have a saveable representation of the filter.

The grid calls the `setModel` function when it wants the filter to restore state, the `model` parameter is the data that we returned in the `getModel` function.

The 'model' is completely under our control so we can use whatever representation required for the filter.

In the example above it is a simple object with a `state` property e.g. `{state: 'off'}`.

These functions are called when the grid api `getFilterModel` and `setFilterModel` functions are called.

To demonstrate this, add some buttons to the grid in `App.js` to save and restore the filters.

```javascript
  const filterState = useRef();

  const onBtSave = useCallback( ()=> {
    filterState.current = gridRef.current.api.getFilterModel();
    console.log('saving', filterState.current);    
  });
  const onBtRestore = useCallback( ()=> {
    console.log('restoring', filterState.current);
    gridRef.current.api.setFilterModel(filterState.current);  
  });

  return (
    <div style={{height: '100%'}}>
      <div>
        <button onClick={onBtSave}>Save</button>
        <button onClick={onBtRestore}>Restore</button>
      </div>
```

When the `save` button is clicked the `getFilterModel` is called. This will call the `getModel` on any active filters.


## Optional API Methods

There are many methods available for implementation on the Custom Filter API Interface.

- https://ag-grid.com/react-data-grid/component-filter/#custom-filter-interface-2


We have already covered the mandatory methods:

- `isFilterActive`
    - true when the filter is active
- `doesFilterPass`
    - return false if the row should be filtered and not displayed
- `getModel`
    - get representation of the filter
- `setModel`
    - restore representation of the filter

Optional methods:

- `getModelAsString`
    - text shown in a floating filter
- `onNewRowsLoaded`
    - called when new rows are loaded to allow filter to adjust if necessary
- `onAnyFilterChanged`
    - called when any filter is changed
- `destroy`
    - when column is destroyed to allow filter to do any necessary cleanup
- `afterGuiAttached`
    - called when the popup is shown

### getModelAsString

The `getModelAsString` function is used when the column shows a floating filter:

```javascript
        { field: 'year', 
              filter: MyFilter,
              filterParams: {
                title: 'Year Filter',
                values: [2000,2004,2006]
              },
              floatingFilter: true
          },
```

The addition of the `floatingFilter` property adds a text field filter in addition to the popup menu, by default this is read only and shows the text returned from the `getModelAsString` function.


```javascript
            getModelAsString() {
                return filterState=='off' ?
                        '' : filterState;
            },
```

The implementation above returns an empty string when there is no filter and the `filterState` value when set. This will show the `filterState` in the read only text field for the floating filter which is a useful way of showing the filter to the user.

The floating filter is also customisable, but the default is the read only text field.

### onNewRowsLoaded

`onNewRowsLoaded` is called whenever new rows are added to the grid, this is useful if the filter has a dependency on the date, e.g. if the values in the filter are pulled from the rows like a set filter.

### onAnyFilterChanged

`onAnyFilterChanged` when any column filter is changed. This can be useful if you want to adapt to the settings in any additional column filter.

### destroy

This is used for other frameworks, the more 'react' way of implementing this is to have a `useEffect` with no dependencies.

```javascript
    useEffect( ()=> {
        console.log(props.title + ' filter created');
        return ()=> console.log(
                    props.title + ' filter destroyed');
    }, []);
```

This is only called when the column is destroyed, not when the column is 'hidden' or the filter menu is closed.

### afterGuiAttached

`afterGuiAttached` is called when the GUI for the filter is rendered on the screen.

This can be useful to add focus to a specific element in the custom GUI created for the filter.

## App Specific API calls

Custom functions can be added to the filter to allow the application to call the filter specifically.

```javascript
    useImperativeHandle(ref, ()=> {
        return {
            somethingToDoWithMyApp(){
                console.log('somethingToDoWithMyApp called');
            }
```

The above API function can be called from the main `App.js` by using the grid api to get an instance of the filter with the `getFilterInstance` function.

```javascript
  const onBtCustomApi = useCallback( ()=> {
    gridRef.current.api.getFilterInstance('year', instance=>{
        instance.somethingToDoWithMyApp();
    });    
  });
```

And if this was the handler for an onClick event:

```javascript
<button onClick={onBtCustomApi}>CustomA API</button>
```

This creates a button in the main app, which when clicked will get the current filter instance on the 'year' column and call the `somethingToDoWithMyApp` function on that filter.

We can also call any function on the instance so could call `isFilterActive` or any of the implemented API functions.

## Summary

Custom Filters are one of the more advanced features of AG Grid and open a lot of flexibility to your interfaces so are worth mastering.

The documentation for custom filters can be found online:

- https://ag-grid.com/react-data-grid/filter-custom/