import React, {useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

export function PodcastGrid(props) {

    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState();

    useEffect(()=>{

      if(!props.rssfeed)
        return;

      if(props.rssfeed.trim()=="")
        return;

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
                        mp3: el.querySelector('enclosure').getAttribute('url'),
                        description: el
                            .querySelector('description')
                            .textContent.replace(/(<([^>]+)>)/gi, ''),
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
          filter: `agGridTextFilter`
        },
        {
          headerName: 'Published',
          field: 'pubDate',
          flex: 1,
          sortable: true,
          filter: 'agDateColumnFilter'
        },
        {
          field: 'description',
          hide: true
        },
        {
          headerName: 'Episode',
          field: 'mp3',
          flex: 1,
          cellRenderer: (params => <audio controls preload="none" 
                                      style={{height:"2em", verticalAlign: "middle"}}>
                                      <source src={params.value} type="audio/mpeg" />
                                  </audio>),
        }
      ];

    const onGridReady = (params) => {
      setGridApi(params.api);
    }

    useEffect(()=>{
      if(gridApi){
        gridApi.setQuickFilter(props.quickFilter);
      }
    }, [gridApi, props.quickFilter])

    return (
       <div className="ag-theme-alpine" style={{height: props.height, width: props.width}}>   
           <AgGridReact
                onGridReady={onGridReady}
                rowData={rowData}
                columnDefs ={columnDefs}
                pagination={true}
                paginationAutoPageSize={true}
                >
           </AgGridReact>
       </div>
    )
};