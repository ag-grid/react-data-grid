# AG Grid React Data Grid - new React UI Demo

This project demonstrates the new React UI.

To run it:

```
npm install
npm start
```

## What does it demo?

The 'Disable/Enable React Ui' button, disables or enables the ReactUI.

When enabled:

- the custom cell renderers do not have a wrapper in the DOM
- the components view shows full hierarchy of react components throughout
- the profiler makes it easy to see the full rendering events involved when clicking [Increase Medals]

When disabled:

- the custom cell renderers in the DOM have a wrapper
- there are fewer components listed
- the profiler shows the rendering for the custom cell renderers but not the grid internals

The numbers next to the cell values show the number of times that the cell has been rendered.

The numbers should not change as you:

- move the columns around
- sort the columns

Try the profiler and see if the impact of the sorting and column moving.



## Live Example

The demo can be viewed live on StackBlitz https://react-data-grid-aggrid-reactui.stackblitz.io/
