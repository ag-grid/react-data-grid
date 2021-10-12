# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Then added AG Grid

```
npm install --save ag-grid-community ag-grid-react
npm install --save ag-grid-enterprise
```


## AG Grid Sparklines

Sparklines were added to AG Grid in version 26.1

- https://www.ag-grid.com/vue-data-grid/sparklines-overview/

The release notification blog describing Sparklines:

- https://blog.ag-grid.com/introducing-ag-grid-sparklines/

There is a lot of information about Sparklines in the documentation. The example here was to highlight a few aspects.

Adding a Sparkline to a grid is done by adding the sparklines cellRenderer to a column definition:

```
{
    field: 'change',
    cellRenderer: 'agSparklineCellRenderer',
}
```

When the data provided to the grid for the column is an array of values, no additional configuration is required. The values will be shown as a line graph Sparkline.


The Sparklines support:

- [line charts](https://ag-grid.com/javascript-data-grid/sparklines-line-customisation/)
- [column charts](https://ag-grid.com/javascript-data-grid/sparklines-column-customisation/)
- [area charts](https://ag-grid.com/javascript-data-grid/sparklines-area-customisation/)

The demo uses the configuration examples from the docs.

## Line Charts

- [line charts](https://ag-grid.com/javascript-data-grid/sparklines-line-customisation/)


```
{
  "field": "change",
  "cellRenderer": "agSparklineCellRenderer",
  "cellRendererParams": {
    "sparklineOptions": {
      "options": {
        "type": "line",
        "line": {
          "stroke": "rgb(124, 255, 178)",
          "strokeWidth": 2
        },
        "padding": {
          "top": 5,
          "bottom": 5
        },
        "marker": {
          "size": 3,
          "shape": "diamond"
        },
        "highlightStyle": {
          "size": 10
        }
      }
    }
  }
}
```

## Column Charts

- [column charts](https://ag-grid.com/javascript-data-grid/sparklines-column-customisation/)

```
{
  "field": "change",
  "cellRenderer": "agSparklineCellRenderer",
  "cellRendererParams": {
    "sparklineOptions": {
      "options": {
        "type": "column",
        "fill": "#91cc75",
        "stroke": "#91cc75",
        "highlightStyle": {
          "fill": "orange"
        },
        "paddingInner": 0.3,
        "paddingOuter": 0.1
      }
    }
  }
}
```

## Area Charts

- [area charts](https://ag-grid.com/javascript-data-grid/sparklines-area-customisation/)

```
{
  "field": "change",
  "cellRenderer": "agSparklineCellRenderer",
  "cellRendererParams": {
    "sparklineOptions": {
      "options": {
        "type": "area",
        "fill": "rgba(216, 204, 235, 0.3)",
        "line": {
          "stroke": "rgb(119,77,185)"
        },
        "highlightStyle": {
          "fill": "rgb(143,185,77)"
        },
        "axis": {
          "stroke": "rgb(204, 204, 235)"
        }
      }
    }
  }
}
```

## Data Types

The Sparklines can take a variety of data formats.

- https://ag-grid.com/react-data-grid/sparklines-data/

By default, an array of numbers is used.

But the grid can also take an Array of Tuples where X is a 'toString' value and Y is the number to render on the Sparkline e.g.

```
[
    [new Date(1976, 6, 4, 12, 30, 0, 0), -37.3],
    [new Date(1977, 6, 4, 12, 30, 0, 0), 16.92],
    [new Date(1978, 6, 4, 12, 30, 0, 0), -19.8],
    [new Date(1979, 6, 4, 12, 30, 0, 0), -62.8],
    [new Date(1980, 6, 4, 12, 30, 0, 0), -25.9],
    [new Date(1981, 6, 4, 12, 30, 0, 0), -23.0],
    [new Date(1982, 6, 4, 12, 30, 0, 0), -8.53]
],
```      

Or an array of objects which have an `xVal` and a `yVal` property e.g.

```
[
    { xVal: 1, yVal: -37.3 },
    { xVal: 2, yVal: 16.92 },
    { xVal: 3, yVal: -19.8 },
    { xVal: 4, yVal: -62.8 },
    { xVal: 5, yVal: -25.91 }
]        
```

To use an object the `sparklineOptions` has to configure the properties to use as the `xKey` and `yKey` e.g.


```
sparklineOptions: {
    type: 'line',
    xKey: 'xVal',
    yKey: 'yVal',
}
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
