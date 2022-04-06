
# React Filters

Columns can be filtered to allow the user to configure the data shown in the grid. Three filters are supplied with AG Grid community edition: text, number and date. An additional set and multi filter are available to the enterprise edition. The filters can also be configured through the API.

https://www.ag-grid.com/react-data-grid/filtering/

## Video Tutorial

https://youtu.be/pebXUHUdlos

00:00 about filters
00:20 default filters
00:55 text, number and date filters
02:38 filter parameters
03:55 filter buttons
05:45 filtering by dates
06:30 filter state models
09:18 floating filters
10:10 Enterprise filters
12:43 Filter Menu Container
13:35 Summary

## Source Code For This Section

The source code for this section is available in Github in the 'react-data-grid' repo and the subfolder `getting-started-video-tutorial/src/005-react-filters`:

- https://github.com/ag-grid/react-data-grid/tree/main/getting-started-video-tutorial/src/005-react-filters


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
        { field: 'date' }
  ]);
  const defaultColDef = useMemo( ()=> ( {
      flex: 1
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

Because we are using a small number of columns, `flex: 1` will spread the columns across the width of the grid.

## Filtering by Column

To filter by as single column, add the filter property to the column definition:

```javascript
        { field: 'athlete', filter: true },
```

The user can then click the hamburger menu in the column header to choose a text filter.

The value `true` can be changed to be a specific filter name, or a custom filter that we code ourselves.

`filter: true` is equivalent to writing:

```javascript
        { field: 'athlete', filter: 'agTextColumnFilter' },
```

`agTextColumnFilter` is the default text filter and is used when the `filter` is set to `true`.


## Built-in Filters

AG Grid comes with 5 built-in filters.

Documentation for these can be found online: https://www.ag-grid.com/react-data-grid/filter-provided-simple/

The three built-in filters for the Community edition are:

- `agTextColumnFilter` : Text Filter
- `agNumberColumnFilter` : Number Filter
- `agDateColumnFilter` : Date Filter

To add these filters we amend the column definitions:

```javascript
  const [columnDefs, setColumnDefs] = useState([
        { field: 'athlete', filter: `agTextColumnFilter` },
        { field: 'age', filter: `agNumberColumnFilter` },
        { field: 'country' },
        { field: 'year' },
        { field: 'date', filter: `agDateColumnFilter` }
  ]);
```

The 'date' filter does not work on the data in the grid because we are retrieving `String` values and adding those to the grid. We need to convert them into dates for the `agDateColumnFilter` filter to work, as we will see later.

## Customizing the Filters with Filter Params

The filters can be customised by adding a `filterParams` object to the column definition:

```javascript
        { field: 'athlete', 
            filter: `agTextColumnFilter`,
            filterParams:{
            }
        },
```

The actual parameters are added as properties of the `filterParams` object.

`filterParams` allow us to add buttons, and debounce the filter.

### debounceMs

The column filters, filter the content as the user types the information into the filter. A debounce can help improve the user experience for some data.

A debounce millisecond time can be set as a Filter Parameter:

```javascript
        { field: 'athlete', 
            filter: `agTextColumnFilter`,
            filterParams:{
                debounceMs: 0
            }
        },
```        

When the debounce value is set to 0 the filter is applied immediately.

If the debounce was set to `2000` then it would take 2 seconds after the user stops typing for the filter to be applied.

The filter params are often applied to the default column definition:

```javascript
  const defaultColDef = useMemo( ()=> ( {
      flex: 1,
      filterParams:{
          debounceMs: 2000
      }
  }), []);
```

### buttons

The buttons filter parameter adds buttons which control the filter e.g. apply, clear.

We can add buttons as follows:

```javascript
  const defaultColDef = useMemo( ()=> ( {
      filterParams:{
          buttons: ['apply','clear']
      }
  }), []);
```

This would cause an `apply` and `clear` button to show under the filter.

There are buttons which can be displayed:

- `apply`: when present the filter is only applied after the user hits the Apply button.
- `clear`: clear the filter form details without removing any active filters on the column.
- `reset`: clear the filter form details and any active filters on that column.
- `cancel`: discard any changes that have been made to the filter, restoring the applied model.

When the `apply` button is used, another filter parameter becomes relevant:

- `closeOnApply` configures the closing of the filter popup when apply button is pressed


### Comparators and Date Filters

Date filters are described in the documentation:

https://www.ag-grid.com/react-data-grid/filter-date/

By default the date filter expects a `Date` object in the grid in order to compare the values. We are also able to add our own comparator functions to compare specific `String` formats or other values.

The comparator will work with other filter types, but its most common use case is for dates.

```javascript
          filterParams: {
                comparator: (dateFromFilter, cellValue) => {
                    if (cellValue == null) { return 0; }

                    const dateParts = cellValue.split('/');
                    const day = Number(dateParts[0]);
                    const month = Number(dateParts[1]) - 1;
                    const year = Number(dateParts[2]);
                    const cellDate = new Date(year, month, day);

                    if (cellDate < dateFromFilter) {
                        return -1;
                    } else if (cellDate > dateFromFilter) {
                        return 1;
                    }
                    return 0;
                }
            }
```

The comparator receives the value in the filter and the value in the cell.

Because the cell value is not a date, we have code to split the string into parts and convert it into a date for comparison.

Finally the comparator returns an integer to determine if the filter value is greater than, less than or equal to the cell value:

- -1 cell value less than filter value
- 1 cell value greater than filter value
- 0 for same value

## Filter State Models

Filter state models are used to set the state of a filter.

We will add two buttons into the returned JSX which will save and apply the state.

```javascript
      <div>
        <button onClick={onBtSave}>Save</button>
        <button onClick={onBtApply}>Apply</button>
      </div>
```

Then the implementation for the `onClick` methods will use the grid API to get and set the state.

```javascript

  const savedFilterState = useRef();

  const onBtSave = useCallback( ()=> {
    const filterModel = gridRef.current.api.getFilterModel();
    console.log('Saving Filter Model', filterModel);
    savedFilterState.current = filterModel;
  }, []);

  const onBtApply = useCallback( ()=> {
    const filterModel = savedFilterState.current;
    console.log('Applying Filter Model', filterModel);
    gridRef.current.api.setFilterModel(filterModel);
  }, []);
```

The api calls:

- `getFilterModel` - returns an object representing the current state of the filter
- `setFilterModel` - sets the current filter using the filter state object

Filter models are described in the documentation:

https://www.ag-grid.com/react-data-grid/filter-api/

The Filter Model could be used to persist the grid state for later application by the user.

The filters can be cleared by setting an empty model e.g.

```javascript
gridRef.current.api.setFilterModel({})
```

## Floating Filters

Floating filters are shown in a tool bar under the heading so that the user doesn't have to access the filters from the popup menu.

Floating filters can be configured using column definitions.

Either on a specific set of columns.

```javascript
    { field: 'athlete', 
        floatingFilter: true,
        filter: 'agTextColumnFilter' 
    },

```

Or on the default column definition:

```javascript
  const defaultColDef = useMemo( ()=> ( {
    floatingFilter: true,
    flex: 1,
  }), []);
```

The filter from the popup menu is kept in sync with the floating filter.

Note that setting `floatingFilter: true` on a column would not be enough to create a filter, the actual `filter` property also needs to be set either with default `true` or with a custom or built-in filter e.g. 'agTextColumnFilter'.

## Enterprise Filters

The enterprise edition of AG Grid comes with two additional, very power filters.

- Set Filter
- Multi Filter

To enable these, the enterprise edition of AG Grid has to be installed, as covered earlier, and we need to import the enterprise modules:

```javascript
import 'ag-grid-enterprise';
```

### Set Filter

The Set filter allows the user to filter values using checkboxes to select items from a set of values.

```javascript
    { field: 'year', filter: 'agSetColumnFilter' },
```            

The set of values used in the drop down are taken from the values in the column.

In addition to selecting items using the checkboxes it is also possible to use the text box to search for items in the set.

These are documented here:

https://www.ag-grid.com/react-data-grid/filter-set/
### Multi Filter

The Multi Filter allows multiple filters to be used, by default the Text Filter and Set Filter are shown. It is possible to configure the filters shown using a `filter` array in the `filterParams`.

A default multi filter can be added as a `filter` property on a column or default column definition.

```javascript
    { field: 'country', filter: 'agMultiColumnFilter' },
```    

https://www.ag-grid.com/react-data-grid/filter-multi/

## Filter Menu Container

By default the filter menus use the grid as the parent container. This means that if the grid is smaller than the filter menu, the filter menu would be cropped to fit the size of the grid.

When working with a smaller grid, it is possible to configure the parent container for the menu by using the `popupParent` property on the grid.

In the example below, the `document.body` is used as the container so no matter what size the grid is, the menu will always be visible.

```javascript
    <AgGridReact ref={gridRef}
        popupParent={document.body}
        rowData={rowData} animateRows={true} 
        columnDefs={columnDefs} defaultColDef={defaultColDef}          
        />
```

Any element in the DOM could be used, so it could be shown anywhere on the web page to fit the needs of your application design.

