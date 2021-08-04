# React Data Grid Example Using Classes

Demo of React Grid Component integration into a React project using React Classes.

This demo code supports the blog post:

- [Create React Components for editing, filters and rendering of React data grid cells](https://blog.ag-grid.com/learn-to-customize-react-grid-in-less-than-10-minutes/)

## Usage Overview
--------------

Use the setup instructions below or go through [a 5-minute-quickstart guide](https://www.ag-grid.com/react-getting-started).

#### Install dependencies

    $ npm install
    $ npm install --save ag-grid-community ag-grid-react

To run the demo:

    $ npm start

#### Import the grid and styles

    import {AgGridReact} from 'ag-grid-react';
    
    import "ag-grid-community/dist/styles/ag-grid.css";
  	import "ag-grid-community/dist/styles/ag-theme-alpine.css";

### Set the grid's configuration in a parent component
	class App extends Component {
		constructor(props) {
			super(props);

			this.state = {
				columnDefs: [
					{headerName: "Make", field: "make"},
					{headerName: "Model", field: "model"},
					{headerName: "Price", field: "price"}

				],
				rowData: [
					{make: "Toyota", model: "Celica", price: 35000},
					{make: "Ford", model: "Mondeo", price: 32000},
					{make: "Porsche", model: "Boxter", price: 72000}
				]
			}
		}
		...
	}

### Render the grid as the `AgGridReact` child component

	class App extends Component {
		constructor(props) {...}

		render() {
			return (
				<div
					className="ag-theme-balham"
					style={{
						height: '500px',
						width: '600px'
					}}
				>
					<AgGridReact
						columnDefs={this.state.columnDefs}
						rowData={this.state.rowData}>
					</AgGridReact>
				</div>
			);
		}
	}


