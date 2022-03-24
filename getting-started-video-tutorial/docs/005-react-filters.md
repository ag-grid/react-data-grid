# React Filters

00:00 about filters
00:20 default filters
00:55 text, number and date filters
02:38 filter parameters
03:55 filter buttons
05:45 filtering by dates
06:30 filter state models

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