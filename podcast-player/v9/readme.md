## Version 9 Upgrading to Version 27

In version 27 of AG Grid, the `cellRenderer` was changed to handle framework components.

So in `PodcastGrid.js` I amended the audio renderer to use jsx

```
          cellRenderer: (params => <audio controls preload="none" 
                                      style={{height:"2em", verticalAlign: "middle"}}>
                                      <source src={params.value} type="audio/mpeg" />
                                  </audio>),
```


There is no need with AG Grid version 27 to configure the React UI 'on' the new 100% React UI is enabled by default so I removed the `reactUI="true"` from the Grid definition:

```
           <AgGridReact

                reactUI="true"

                onGridReady={onGridReady}
                rowData={rowData}
                columnDefs ={columnDefs}
                pagination={true}
                paginationAutoPageSize={true}
                >
           </AgGridReact>
```


became:


```
            <AgGridReact
                onGridReady={onGridReady}
                rowData={rowData}
                columnDefs ={columnDefs}
                pagination={true}
                paginationAutoPageSize={true}
                >
           </AgGridReact>
```