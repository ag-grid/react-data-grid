# React Data Grid Example Using Classes

Demo of React Grid Component integration into a React project using React Classes.

This demo code supports the blog post:

- [Create React Components for editing, filters and rendering of React data grid cells](https://blog.ag-grid.com/learn-to-customize-react-grid-in-less-than-10-minutes/)

## Usage Overview
--------------

Use the setup instructions below or go through [a 5-minute-quickstart guide](https://www.ag-grid.com/react-getting-started).

### To Run The Demo

```shell
$ npm install
$ npm start
```

### To Create the Example from Scratch

Create the basic app structure with `create-react-app`

```
npx create-react-app my-app
cd my-app
npm start
```

Add AG Grid and AG Grid React into your project.

```
npm install --save ag-grid-community ag-grid-react
```

#### Import the grid and styles

```
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
```	  

#### Set the grid's configuration in a parent component
```javascript
class App extends Component {

	constructor(props) {
        super(props);

        this.state = {
            rowData: [
                {make: "Toyota", model: "Celica", price: 35000},
                {make: "Ford", model: "Mondeo", price: 32000},
                {make: "Porsche", model: "Boxter", price: 72000}
            ]
        }
    }

    render() {
        return (
            <div
                className="ag-theme-balham"
                style={{ height: '200px', width: '600px' }}
            >
                <AgGridReact
                    rowData={this.state.rowData}>
                    <AgGridColumn field="make"></AgGridColumn>
                    <AgGridColumn field="model"></AgGridColumn>
                    <AgGridColumn field="price"></AgGridColumn>
                </AgGridReact>
            </div>
        );
    }
}
```

This renders the grid as the `AgGridReact` child component.



