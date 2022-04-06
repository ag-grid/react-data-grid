# QuickStart React and AG Grid Tutorial

Welcome to the "QuickStart React and AG Grid Tutorial," created by Niall Crosby. The tutorial text, example source code, and walk-through videos will help you become proficient with AG Grid using React very quickly.

AG Grid is an Enterprise-level Data Grid that powers applications for most of the Fortune 500; it supports multiple frameworks with the same functionality and API due to its MVC architecture. To make the development experience for each framework seamless, we have rendering engines specific to the framework.

## AG Grid Introduction

AG Grid has a 100% React Data Grid rendering engine, so you'll be able to use all the standard React development tools to profile and optimize your application. We have an entire section on optimizing the grid in "React Rendering."

AG Grid comes in two editions, the 100% free and MIT Licensed Community edition. You are free to use this in any commercial application, and we have applications showcased on our website that do precisely this.

- https://blog.ag-grid.com/showcase/

We also have an Enterprise edition if you need more features like pivoting, aggregation, Excel export, integrated charts, and custom toolbars.

We don't mind if you stick with the Community Edition or the Enterprise Edition; it's important to pick the best component that meets your needs. Both editions are fully featured and customizable with React Components, allowing you to create custom editors and renderers to show whatever you want in the grid cells.

Much of the grid is customizable by simple properties; as you'll see in the early sections, we can enable sorting, filtering, and pagination in seconds:

- `sortable: true`
- `filter: true`

```javascript
{ field: 'make', sortable: true, filter: true },
```

And pagination is a grid property:

- `pagination: true`

```javascript
const gridOptions = {
  columnDefs: columnDefs,
  pagination: true
};
```

But we don't want to show you too much code too quickly. We just want to give you a hint as to how much you can achieve with very little code.

We know that writing an interactive data grid or data table can be a fun and challenging project; after all, we've had a team of dedicated programmers working on AG Grid for over seven years.

We also know that it can be very hard. Creating a simple table to sort when you click a heading is relatively easy. Adding filtering, lots of data, high-frequency updates, data grouping, and column ordering becomes more challenging. Not forgetting all the other features that your users will want to see as your project matures.

It takes time to build and maintain a data grid component, so this tutorial will allow you to look at AG Grid and try out the community edition before writing your own. You'll be able to get up and running quickly and add business value to your users faster than writing and maintaining a custom-built data grid.


## What's a Data Grid?

A data grid is a tabular rendering of data in a web app, like embedding an Excel sheet on a page.

Data grids differ from data tables in several ways:

- users don't expect tables to be interactive
- tables grow and shrink based on the contents, whereas a data grid is a fixed size leading to a consistent user interface

Standard features you would expect to find in a Data Grid are:

- sorting
- multi-column sorting
- filtering
- drag and drop row and column ordering
- pagination
- scroll bars for data to keep grid size consistent
- cell editing
- column and row virtualization
- row selection
- column grouping
- row and column pinning

All of the above, with a lot more features, are available in the community edition of AG Grid and configurable through simple properties, so it should be powerful enough to meet your needs for a data grid. And if you discover you need a custom filter, editor, or renderer, you can create a custom React Component to implement your domain feature, as we will explain in detail in this tutorial.

A Data Grid also differs from a Data Table in that a Table is built on top of an HTML `table` element, whereas a Data Grid will often manipulate the DOM directly and is built on top of `div` elements. This can simplify the DOM virtualization to reduce memory overhead and improve performance for high-frequency updates.

If you are interested in seeing if AG Grid meets your long term needs, then we have a list of features in the documentation:

- https://ag-grid.com/javascript-data-grid/licensing/


## About the Tutorial Author

The tutorial was created by Niall Crosby, CEO of AG Grid and the initial developer. Niall has remained hands-on with AG Grid since it started and was heavily involved with creating the React Rendering Engine, so you'll be learning from someone who knows all the details of AG Grid.

You can find Niall online:

- https://twitter.com/niallcrosby
- https://linkedin.com/in/niallcrosby
- https://blog.ag-grid.com/author/niall/

## Introduction To Tutorial

This text contains a self-guided tutorial to help you quickly get started with AG Grid and React. Through a series of text content explaining the incremental development of code, it walks you through the basic concepts that help you get the most from AG Grid with React.

We can't cover everything in this text. Niall has pulled out the most critical concepts to help you get started and cover the most common use-cases. Still, we recommend you read the documentation because the grid API is rich and very flexible.

The AG Grid documentation is online at:

- https://www.ag-grid.com/react-data-grid/

AG Grid supports multiple frameworks, and you can view the documentation for different frameworks by clicking the framework icon.

There are plenty of embedded examples in the documentation that are runnable or click to view and edit them online to help you experiment without installing anything.

All the source code for this tutorial is on Github.

The repo 'react-data-grid' contains all the React tutorials and examples used on our blog:

- https://github.com/ag-grid/react-data-grid

The folder for this tutorial is:

- https://github.com/ag-grid/react-data-grid/tree/main/getting-started-video-tutorial

You can find the source code in the `src` sub-folder.

Each chapter is in its own folder as stand-alone projects.

## Installing Prerequisites

### Node.js

Pre-requisites are having Node installed because we will use npx to install the packages and we will use the `create-react-app` to create a simple application structure.

You can find instructions and downloads for installling Node.js on [nodejs.org](https://nodejs.org)

- https://nodejs.org/en/download/

### IDE

We typically recommend Visual Studio Code as a good IDE because it is free and easy to install for each platform.

- https://code.visualstudio.com/


## Let's Go

Now. Let's get started.
