## To Run The Demo

```shell
$ npm install
$ npm start
```

## To Create the Example from Scratch

Create the basic app structure with `create-react-app`

```
npx create-react-app getting-started-5-mins-hooks
cd getting-started-5-mins-hooks
npm start
```

Add AG Grid and AG Grid React into your project.

```
npm install --save ag-grid-community ag-grid-react
```

## Simplest Example Grid Component

The simplest example is to have the default row data as a module based const, and the column definitions declarative within the JSX.

```
const InitialRowData = [
    {make: "Toyota", model: "Celica", price: 35000},
    {make: "Ford", model: "Mondeo", price: 32000},
    {make: "Porsche", model: "Boxter", price: 72000}
];

export function CarsGrid() {

    // set to default data
    const [rowData, setRowData] = useState(InitialRowData);

   return (
       <div className="ag-theme-alpine" style={{height: 400, width: 600}}>   
           <AgGridReact
                defaultColDef={{sortable: true, filter: true }}
                pagination={true}
                rowData={rowData}>
                <AgGridColumn field="make"></AgGridColumn>
                <AgGridColumn field="model"></AgGridColumn>
                <AgGridColumn field="price" editable={true}></AgGridColumn>
           </AgGridReact>
       </div>
   )
};
```

Loading Data from a server on first render can be done with an effect:

```
    // load the data after the grid has been setup
    useEffect(() => {
        fetch('https://www.ag-grid.com/example-assets/row-data.json')
            .then(result => result.json())
            .then(rowData => setRowData(rowData))
    }, []);
```

## Considerations When Using AG Grid with React

### Make ColumnDefs Objects

The previous example uses declarative column definitions. Because these are baked into the JSX we will find it difficult to change the grid at runtime.

By making the column definitions objects and part of the state, we can change them as necessary and the grid component will re-render.

```
const InitialRowData = [
    {make: "Toyota", model: "Celica", price: 35000},
    {make: "Ford", model: "Mondeo", price: 32000},
    {make: "Porsche", model: "Boxter", price: 72000}
];

export function CarsGrid() {

    // set to default data
    const [rowData, setRowData] = useState(InitialRowData);
    const [colDefs, setColDefs] = useState([
        {field: 'make'},
        {field: 'model'},
        {field: 'price', editable: 'true'},
    ]);

   return (
       <div className="ag-theme-alpine" style={{height: 400, width: 600}}>   
           <AgGridReact
                defaultColDef={{sortable: true, filter: true }}
                pagination={true}
                rowData={rowData}
                columnDefs={colDefs}>
           </AgGridReact>
       </div>
   )
};
```

With the above code I can amend the columns in the grid programmatically by changing the state. I've added it into a `useEffect` just to add a delay to make the change in grid more obvious.

e.g.

```
    useEffect(
        ()=> {
        const changeColsTimer = setTimeout(() =>{
            setColDefs([{field: 'make'},{field: 'model'}])
            },3000);
        return ()=>clearTimeout(changeColsTimer);
            }
    ,[]);
```

Defining the columns as objects through State offers more flexibility than declaring the columns in the JSX directly.

### Memoise data that will not change

If I didn't want to change the column defs then I would memoize them when mounting the component and move the data setup into the useSate definition.

This will isolate the data so that it is no longer a Singleton shared across different instances of the CarsGrid component and by memoizing the data is should speed up the rendering time when state, props or parent changes.

```

export function CarsGrid() {

    const [rowData, setRowData] = useState([
        {make: "Toyota", model: "Celica", price: 35000},
        {make: "Ford", model: "Mondeo", price: 32000},
        {make: "Porsche", model: "Boxter", price: 72000}
    ]);

    const colDefs = useMemo( ()=> [
    	{field: 'make'},
    	{field: 'model'},
    	{field: 'price', editable: 'true'},
    ], []);

   return (
       <div className="ag-theme-alpine" style={{height: 400, width: 600}}>   
           <AgGridReact
                defaultColDef={{sortable: true, filter: true }}
                pagination={true}
                rowData={rowData}
                columnDefs={colDefs}>
           </AgGridReact>
       </div>
   )
};
```