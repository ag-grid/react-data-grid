import React, {useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

export function PodcastGrid(props) {

        const [rowData, setRowData] = useState([
                                    {title: "my episode", 
                                    pubDate: new Date(), 
                                    mp3: "https://mypodcast/episode.mp3"}]);

    var columnDefs = [
        {
          headerName: 'Episode Title',
          field: 'title',
        },
        {
          headerName: 'Published',
          field: 'pubDate',
        },
        {
          headerName: 'Episode',
          field: 'mp3',
        }
      ];

    return (
       <div className="ag-theme-alpine" style={{height: props.height, width: props.width}}>   
           <AgGridReact
                rowData={rowData}
                columnDefs ={columnDefs}
                >
           </AgGridReact>
       </div>
    )
}