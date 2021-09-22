import React, {useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

export function PodcastGrid(props) {

    const [rowData, setRowData] = useState([]);

    useEffect(()=>{

      fetch(props.rssfeed)
                .then(response => response.text())
                .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
                .then(data => {            
                    const itemList = data.querySelectorAll('item');
            
                    const items=[];
                    itemList.forEach(el => {
                        items.push({
                        pubDate: new Date(el.querySelector('pubDate').textContent),
                        title: el.querySelector('title').innerHTML,
                        mp3: el.querySelector('enclosure').getAttribute('url')
                        });
                    });

                    setRowData(items)
                });

    },[props.rssfeed]);

    var columnDefs = [
        {
          headerName: 'Episode Title',
          field: 'title',
          wrapText: true,
          autoHeight: true,
          flex: 2,
          resizable: true,
        },
        {
          headerName: 'Published',
          field: 'pubDate',
          sortable: true,
        },
        {
          headerName: 'Episode',
          field: 'mp3',
          flex: 2,
          cellRenderer: ((params)=>`<audio controls preload="none"
                                        style="height:2em; vertical-align: middle;">
                                        <source src=${params.value} type="audio/mpeg" />
                                    </audio>`),
          autoHeight: true
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
};