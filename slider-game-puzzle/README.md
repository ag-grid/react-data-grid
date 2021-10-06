# Slider Tile Game Puzzle

AG Grid's new React Rendering Engine is written 100% in React. To demonstrate the use of custom headers in the new React Rendering Engine we created a simple game to add buttons in the header, the game code also demonstrates other customization approaches using CSS and `customStyle` property.

## What is a Slider Game Puzzle?

This is a small implementation of a slider puzzle where the puzzle:

- has a 3x3 grid of tiles
- tiles 9 is missing to create a space
- tiles can be moved into the space
- when the tiles are in order the puzzle is complete

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

The AG Grid game front end uses the `AgGridReact` front end, set to `reactUi="true"` to enable the [new React rendering engine](https://ag-grid.com/react-data-grid/reactui/), this improves the performance and experience of using AG Grid with the React Developer Tools.

## Customization of AG Grid

AG Grid supports customization in many different ways. For this game we use:

- Custom React Components
- The Custom React Components styled by CSS
- Grid Options have a `cellClass` which uses a function to provide different class names for the cells based on their contents.

## Custom Header Components

Custom Header Components for AG Grid are simple to create in React. Full details are in the [custom header documentation](https://www.ag-grid.com/react-data-grid/component-header/).

When a custom header is provided to the grid it becomes the responsibility of the programmer to handle the header events like displaying sorting and filtering icons.

Fortunately, for this game we don't need sorting, filtering or menus, so our components are the simplest examples of custom headers.

The Up and Down button component header in [UpDownButtonsHeader.jsx](https://github.com/ag-grid/react-data-grid/blob/main/slider-game-puzzle/src/UpDownButtonsHeader.jsx)

```javascript
const UpDownButtonsHeader = (props) => {

    const onClick = (e)=> {
        props.actionCallBack(e.target.name, props.column.instanceId);
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

The parent Grid can then move the tiles.

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




