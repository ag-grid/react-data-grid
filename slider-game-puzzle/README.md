# Slider Tile Game Puzzle

AG Grid's new React Rendering Engine is written 100% in React. To demonstrate the use of custom headers in the new React Rendering Engine we created a simple game to add buttons in the header using a custom header renderer, the game code also demonstrates other customization approaches using CSS, `className` property and custom cell renderer.

[You can play the finished game on Github.io](https://ag-grid.github.io/react-data-grid/slider-game/index.html)

## What is a Slider Game Puzzle?

This is a small implementation of a slider puzzle where the puzzle:

- has a 3x3 grid of tiles,
- tile 9 is missing to create a space,
- tiles can be moved into the space,
- when the tiles are in order the puzzle is complete.

```
123
456
78.
```

To implement this in AG Grid I created custom Cell and Header Components for the buttons.

- `LeftRightButtons.jsx`
    - are the left and right buttons on the left hand side. These will slide the tiles in the row, left or right if there is a space available on that row.
    - [code for LeftRightButtons.jsx](https://github.com/ag-grid/react-data-grid/blob/main/slider-game-puzzle/src/LeftRightButtons.jsx)
- `UpDownButtonsHeader.jsx`
    - are custom header controls, pressing the buttons will move the tiles up or down if there is a space on that column.
    - [code for UpDownButtonsHeader.jsx](https://github.com/ag-grid/react-data-grid/blob/main/slider-game-puzzle/src/UpDownButtonsHeader.jsx)
- `ControlButtons.jsx`
    - are the control buttons in the top left of the grid. These are custom header buttons for the first column.
    - `[Done?]` checks if the tiles are in the right order and displays a message telling you if you have won or not
    - `[@]` will randomly shuffle the tiles about, otherwise the game is no fun!
    - [code for ControlButtons.jsx](https://github.com/ag-grid/react-data-grid/blob/main/slider-game-puzzle/src/ControlButtons.jsx)

The game is written using [AG Grid Community edition](https://www.ag-grid.com/) which is the free Data Grid available for React, Angular, JavaScript and Vue.

This example is written using React with the new React Rendering Engine used by AG Grid which is 100% written in React. [Learn more about AG Grid's React Support Here](https://www.ag-grid.com/react-data-grid/getting-started/)

This example uses the new React Rendering Engine and demonstrates the use of the main grid, custom cell components and support for custom header components.

The game engine itself is not written in React. It is a simple [JavaScript object](https://github.com/ag-grid/react-data-grid/blob/main/slider-game-puzzle/src/SliderGame.js).


## Customization of AG Grid

AG Grid supports customization in many different ways. For this game we use:

- Custom React Components for Cell Renderer and Header Component.
- The Custom React Components styled by CSS.
- Grid Options have a `cellClass` which uses a function to provide different class names for the cells based on their contents.

## Custom Header Components

Custom Header Components for AG Grid are simple to create in React. Full details are in the [custom header documentation](https://www.ag-grid.com/react-data-grid/component-header/).

When a custom header is provided to the grid it becomes the responsibility of the programmer to handle the header events like displaying sorting and filtering icons.

Fortunately, for this game we don't need sorting, filtering or menus, so our components are the simplest examples of custom headers.

The Up and Down button component header in [UpDownButtonsHeader.jsx](https://github.com/ag-grid/react-data-grid/blob/main/slider-game-puzzle/src/UpDownButtonsHeader.jsx)

```javascript
const UpDownButtonsHeader = (props) => {

    const onClick = (e)=> {
        props.actionCallBack(e.target.name, props.column.instanceId-1);
    };

    return (
        <div className="header-buttons-outer">
            <span className="header-buttons">            
                <button name="up" onClick={onClick}>^</button> &nbsp;
                <button name="down" onClick={onClick}>v</button>
            </span>
        </div>
    );
};

export {UpDownButtonsHeader}

```

The component simply renders the controls and binds an `onClick` handler. The `onClick` handler delegates the functionality off to a callback, supplied in `props` from the parent component to return the button name and the column number.

The column `instanceId` start at 1, internally the sliding puzzle is 0 indexed, so I pass in the column's `instanceId-1`.

The parent Grid can then control how the tiles are moved, the buttons are there for the user to interact with.

The header for the control buttons is similarly very small, contained in [ControlButtons.jsx](https://github.com/ag-grid/react-data-grid/blob/main/slider-game-puzzle/src/ControlButtons.jsx)

```javascript
const ControlButtons = (props) => {

    const onCheck = ()=> {
        props.actionCheckCallback();
    };
  
    const onShuffle = ()=> {
      props.actionShuffle();
    };
  
    return (
        <div className="header-buttons-outer">
            <span className="header-buttons">
                <button name="check" onClick={onCheck}>Done?</button> &nbsp;
                <button name="shuffle" onClick={onShuffle}>@</button>
            </span>
        </div>
    );
  };

export {ControlButtons}  
```

This again delegates the functionality off to callbacks supplied via `props`.

I used `className` based styling on the `div` and `span` to keep the example code simple and to support development of the functionality independent of the styling of the application.

## Custom Cell Component

The custom cell component for the left hand column, with buttons to slide the tiles left and right, looks very similar to the header component.

Contained in [LeftRightButtons.jsx](https://github.com/ag-grid/react-data-grid/blob/main/slider-game-puzzle/src/LeftRightButtons.jsx)

```javascript
const LeftRightButtons = (props)=>{

    const onClick = (e)=> {
        props.actionCallBack(e.target.name, props.rowIndex);
    };
  
    return (
        <div className="cell-buttons-outer">
          <span className="cell-buttons">
              <button name="left" onClick={onClick}>&lt;</button> &nbsp;
              <button name="right" onClick={onClick}>&gt;</button>
          </span>
      </div>
    );
  }

  export {LeftRightButtons}
```

This cell renderer component is very similar to the header components because the example does not need to reflect grid properties or interact with the grid API. [Cell Renderer](https://www.ag-grid.com/react-data-grid/component-cell-renderer/) documentation can be found in the documentation.

## Grid Wrapper `GridSliderGame`

I will describe the code for the data grid and how it uses the components to style and interact with the game.
### Create Wrapper Components for React Data Grid

Rather than put all my code in the `App.js` I created a React Component for the Grid interface to the game.

I embed it in `App.js`

```javascript
function App() {
  return (
    <div style={{width:"100%", height:"400px"}}>
    <GridSliderGame></GridSliderGame>
    </div>
  );
}
```

This gives me the flexibility to adjust the GUI as required, without impacting the main application.

Because my 'game' is a separate object, my `GridSliderGame` is focussed on the rendering and interaction, so does not become cluttered with domain logic for the game.

After importing all the necessary libraries and components, including the css file to style the game components:

```javascript
import './game.css';
import { AgGridReact } from 'ag-grid-react';
import React, { useMemo, useState } from 'react';

import {SliderGame} from './SliderGame'
import {UpDownButtonsHeader} from './UpDownButtonsHeader'
import {ControlButtons} from './ControlButtons'
import {LeftRightButtons} from './LeftRightButtons'
```

I create the `GridSliderGame` component itself:

```javascript
function GridSliderGame() {
```

### State for Game and Grid

The Grid front end for the game uses two stateful variables:

```javascript
    const [game, setGame] = useState();
    const [rowData, setRowData] = useState([]);        

  
    useEffect(()=>{
        const aGame = new SliderGame();
        setGame(aGame);
        setRowData(aGame.getDataAsRows())
    }
    ,[]); 
```

One is the `game` itself, and the other is the `rowData` which we will render to the Grid.

The game controls are all provided by the Header and Cell Renderer components, so the first thing I do is create the functions which wire these together.

The `SliderGame` is the business logic, or domain logic for the game. The `GridSliderGame` is the presentation layer that the user sees and interacts with.

### Callback Functions for Props

`reorderGrid` is the function that will be called by the up, down, left and right buttons in the header and row cell renderer. This function will be passed into the custom component as a prop when we define the column definitions. The game action of moving pieces will be delegated to the game object and the game will then return the new state of the tiles which we will use to set the row data in the grid.

```javascript
    const reorderGrid = (actionName, actionOn)=>{
        setRowData(game.movePieces(actionName, actionOn));
    } 
```

Similarly, when the `@` button is pressed to shuffle the tiles around, the `shuffleData` function will be called. This will delegate to the `game` to re-order the pieces, and then return the status of the tiles so that we can render them in the grid.

```javascript
    const shuffleData = ()=>{
        game.shuffleData();
        setRowData(game.getDataAsRows());
    }
```

When the `Done?` button is pressed, we will ask the `game` if the puzzle is done, and then render an appropriate message to the player. The `checkPuzzleDone` function will be passed to the `ControlButtons` component as a `prop`.

```javascript
    const checkPuzzleDone = ()=>{
        if(game.isPuzzleDone()){
            alert("Puzzle complete, well done!");
        }else{
            alert("Sorry, not done yet");
        }
    }
```

### Styling with `className` Function

All of the styling customization of the grid is performed using CSS. The cells in the grid are styled differently depending whether they have a number or are blank. To achieve this effect I use the `className` property on the column definitions. `className` can take either a string literal or a function. Since I need the styling to be dynamic based on content I create a function that will be used:

```javascript
    const blankOrNumberTile = (params)=> {
        return params.value === '' ? 'blank-tile' : 'tile-cell';
    };
```

The `blankOrNumberTile` will be passed the cell parameters, and based on the value in the cell will either set the tile as a class of `blank-title` or `tile-cell`, where a `tile-cell` has content.

All of the wiring for the grid takes place in the column definitions:

```javascript
    const columnDefs = [ 
        ...
    ];   
```

The [Cell Styling options are described in the documentation](https://www.ag-grid.com/react-data-grid/cell-styles/). The simple cell styling could be done, as I have, with the `className` or a `classStyle` could be used to set the inline style for the element. Also cell class rules are available which support a simplified DSL for creating Excel like formatted cells.

Alternatively, we could use a Cell Renderer, as I did for the left and right buttons.

### Wiring Functionality With Column Definitions

The `columnDefs` is an array of Column Definition objects to define the field to map to in the `rowData` and additional styling and handling.

We haven't seen the `rowData` yet, because this is returned from the `game` functions. Our `rowData` consists of an array of objects where each object has three fields `pos1`, `pos2`, `pos3` e.g. the object below would represent the `completed` state of the tile puzzle

```javascript
[
    {`pos1`: '1', `pos2`:`2`, `pos3`:`3`},
    {`pos1`: '4', `pos2`:`5`, `pos3`:`6`},
    {`pos1`: '7', `pos2`:`8`, `pos3`:``},
]
```

i.e. when the tile looks like:

```
123
456
78
```

The column definitions create for the Data Grid also include a column not reference here, because it is a `control` column with a custom cell renderer that doesn't depend on a data value in the row data.

The first column definition is the `control` column, this is one of the objects in the `columnDefs` array:

```javascript
    const columnDefs = [    
        {
            headerName: 'controls',
            cellRenderer: LeftRightButtons,
            cellRendererParams: {actionCallBack: reorderGrid},
            headerComponent: ControlButtons,
            headerComponentParams:
                {
                    actionCheckCallback: checkPuzzleDone,
                    actionShuffle: shuffleData
                },
            cellClass: 'blank-tile'
        },
```

This column definition has a `headerName` that will not be visible because we are using a custom Header Component. The `cellClass` has been hard coded in the definition to be of type `blank-tile`.

To use a custom component as a Cell Renderer I have to set a cell renderer property. I'm using a cell renderer created in React so I wire up my `LeftRightButtons` component as a `cellRenderer` property. I pass `props` to this component using the `cellRendererParams`, these can be any object so I'm passing in the `reorderGrid` callback as the `actionCallBack` property.

Similarly, I add a header component using the `headerComponent` property. I add the `ControlButtons` component, and pass in the `checkPuzzleDone` function and `shuffleData` functions as `props` to the component using the `headerComponentParams`.

All the other columns are similar since they represent the same type of data. This is unusual for a Data Grid, but is a side-effect of it being used as a front end to a game engine.

```javascript
{   
    field: 'pos1', 
    headerComponent: UpDownButtonsHeader, 
    headerComponentParams:{actionCallBack: reorderGrid},
    cellClass: blankOrNumberTile
},
```

Here the column is mapped to a data value in the `rowData` through the use of the `field` property.

The remainder of the properties are to wire up the functionality.

The `headerComponent` and `headerComponentParams` are used once again to wire up the custom header, this time the `UpDownButtonsHeader` component is used. In addition the `cellClass` is configured to decide the class name for the cell using the `blankOrNumberTile` function.


The remaining column definitions are the same, the only difference is the `field` that they are wired to:

```javascript
{   
    field: 'pos2', 
    headerComponent: UpDownButtonsHeader,
    headerComponentParams:{actionCallBack: reorderGrid},
    cellClass: blankOrNumberTile
},
{   
    field: 'pos3', 
    headerComponent: UpDownButtonsHeader, 
    headerComponentParams:{actionCallBack: reorderGrid},
    cellClass: blankOrNumberTile
}
```        

### Configuring the Grid Properties

The final step is to configure the grid itself.

We are using the `AgGridReact` component which is the React Rendering Engine for AG Grid.

```javascript
    const defaultColDef = {
        maxWidth:150,
        width:120
    }

    return (
        <AgGridReact 
            className="ag-theme-alpine"
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowData={rowData}
            rowHeight={80}
        />
    );
```

The default grid styling is from AG Grid's theme `ag-theme-alpine`, then the column definitions and row data are added, along with the `rowHeight` in pixels.

When the `rowData` state is updated, the grid will refresh to render the new state of the game tiles.

I added some column sizing via the defaultColDef to control the size of the columns and make it more like a square puzzle.

### Game Engine

The game code can be found in the `SliderGame.js` code.

- [SliderGame.js on Github](https://github.com/ag-grid/react-data-grid/blob/main/slider-game-puzzle/src/SliderGame.js)

I don't plan to discuss the game engine in this text because it is fairly standard JavaScript.

I chose to isolate all the game functionality into a separate object to make the Data Grid wrapper cleaner and focussed on the interaction and rendering, and not have to cram in the code for the game domain logic. This will also help make it easier to add automated tests to the project.

### CSS

Most of the styling is supplied by the [AG Grid Theme Engine](https://www.ag-grid.com/react-data-grid/themes/) but I did add some CSS to style the classes that I added from the cell and header components, and the class name styling on the column.

Because I'm using a theme from AG Grid, the CSS is pretty small:


```css
.header-buttons-outer{
    width: 100%;
    text-align: center;
  }
  
.header-buttons{
    font-size: 2em;
}

.cell-buttons-outer{
    text-align: center;
}

.cell-buttons{
    font-size: 4em;
}
  
.blank-tile{
    background-color: white;
    color: black;
}

.tile-cell{
    padding: 15px;
    background-color: black;
    color: white;
    text-align: center;
    font-size: 60px;
    border: 5px outset rgb(114, 114, 114) !important;
}
```


## Summary

That was just a fun little project to demonstrate some of the customization possible with AG Grid:

- [Cell Renderers](https://www.ag-grid.com/react-data-grid/component-cell-renderer/)
- [Header Components](https://www.ag-grid.com/react-data-grid/component-header/)
- [Cell Styling](https://www.ag-grid.com/react-data-grid/cell-styles/)
- [Themes](https://www.ag-grid.com/react-data-grid/themes/) and CSS Styling

The [full code is available on Github](https://github.com/ag-grid/react-data-grid/tree/main/slider-game-puzzle), and you can [play the slider puzzle game online](https://ag-grid.github.io/react-data-grid/slider-game/index.html).

Feel free to play around with the code to learn a little more about AG Grid. Some things you might try are:

- changing the styling
- trying a different theme
- add a counter to the game for number of moves required to solve the game

Or, just play the game and see how well you do.



## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

```
npx create-react-app slider-game-puzzle
```

You can run it by ensuring you are in the `slider-game-puzzle` folder and using `npm install` followed by `npm start`:

```
cd slider-game-puzzle
npm install
npm start
```

The browser should appear and load hte app from [http://localhost:3000](http://localhost:3000).

The gitpages deploy, allows you to run the game in the browser without setting up a development environment:

[play the game here on gitpages](https://ag-grid.github.io/react-data-grid/slider-game/index.html)

At [https://ag-grid.github.io/react-data-grid/slider-game](https://ag-grid.github.io/react-data-grid/slider-game/index.html)




