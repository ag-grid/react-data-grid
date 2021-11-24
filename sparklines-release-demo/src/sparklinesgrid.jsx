import React, { useEffect, useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


const NUMBER_OF_VALUES = 10;
const NUMBER_OF_ROWS=8;

const getRandomValues = (dataType)=>{
    return Array(NUMBER_OF_VALUES).fill().map((item, i) =>{
      if(dataType==="numbers"){
        return Math.random();
      }
      if(dataType==="tuples"){ 
        return [new Date(), Math.random()];
      } 
      //if(dataType==="objects"){
      return {xVal: new Date(), yVal: Math.random()};
      //}
    });
}


function getData(type="numbers"){

  const vals =[];
  for(var i=0;i<NUMBER_OF_ROWS;i++){
    const ticker={};
    ticker.symbol = String.fromCharCode(65+i);
    ticker.name = "Ticker " + i;
    ticker.change = getRandomValues(type);
    ticker.volume = Math.floor(Math.random()*1000000);    
    vals.push(ticker);
  }
  return vals;
}

const SparklinesGrid = () => {

    const [rowData, setRowData] = useState([]);
    const interval = useRef(100);
    const gridRef = useRef(null);
    const [gridApi, setGridApi] = useState();
    
    const [feedInterval, setFeedInterval] = useState();
    const [sparkType, setSparkType] = useState("lines");
    const [dummyOptions, setDummyOptions] = useState({});
    const [dataType, setDataType] = useState("numbers");

    useEffect(()=>{
        setRowData(getData(dataType));
    },[dataType]);

    const gridOptions = {
        columnDefs: [
          { field: 'symbol', maxWidth: 120 },
          { field: 'name', maxWidth: 150 },
          {
            field: 'change',
            cellRenderer: 'agSparklineCellRenderer',
          },
          {
            field: 'volume',
            type: 'numericColumn',
            maxWidth: 140,
            cellRenderer: 'agAnimateShowChangeCellRenderer'
          },
        ],
        defaultColDef: {
          flex: 1,
          minWidth: 100,
          resizable: true,
        },
        rowData: getData(),
        rowHeight: 50
      };

      //https://www.ag-grid.com/react-data-grid/sparklines-line-customisation/
      const lineSparklineOptions = {
        type: 'line',
        line: {
            stroke: 'rgb(124, 255, 178)',
            strokeWidth: 2
        },
        padding: {
            top: 5,
            bottom: 5
        },
        marker: {
            size: 3,
            shape: 'diamond',
        },
        highlightStyle: {
            size: 10,
        },
    };

    // https://www.ag-grid.com/react-data-grid/sparklines-bar-customisation/

    const barSparklineOptions = {
        type: 'bar',
        fill: '#5470c6',
        stroke: '#91cc75',
        highlightStyle: {
          fill: '#fac858',
        },
        valueAxisDomain: [0, 1],
    }

    // https://www.ag-grid.com/react-data-grid/sparklines-column-customisation/
    const columnSparklineOptions = {
        type: 'column',
        fill: '#91cc75',
        stroke: '#91cc75',
        highlightStyle: {
            fill: 'orange'
        },
        paddingInner: 0.3,
        paddingOuter: 0.1,
    };    

    // https://www.ag-grid.com/react-data-grid/sparklines-area-customisation/
    const areaSparklineOptions = {
        type: 'area',
            fill: 'rgba(216, 204, 235, 0.3)',
        line: {
            stroke: 'rgb(119,77,185)',
        },
        highlightStyle: {
            fill: 'rgb(143,185,77)',
        },
        axis: {
            stroke: 'rgb(204, 204, 235)',
        }
    };

    const getSparklinesOptions = (options, type)=>{

        const myOptions = JSON.parse(JSON.stringify(options));
        if(type==="objects"){
            myOptions.xKey='xVal';
            myOptions.yKey='yVal';
        }

        return myOptions;
    }


    const setSparklinesOptions = (options)=>{

        var columnDefs;
        //const api = gridRef.current.api;
        const api = gridApi;

        if(!api){
            return;
        }

        columnDefs = api.getColumnDefs();

        if(!columnDefs){
            return;
        }

        columnDefs.forEach(function (colDef) {
            if(colDef.field==="change"){
                colDef.cellRendererParams={sparklineOptions: options};            
            }
        });
        api.setColumnDefs(columnDefs);

        // rerender the sparklines
        api.redrawRows();        
    };


    const startFeed = ()=> {

        setFeedInterval(
            setInterval(function () {

                // pick a random row  
                const row = gridRef.current.api.getModel().getRow(Math.floor(Math.random()*NUMBER_OF_ROWS));
                const rowData = row.data;
                const data = rowData.change.map(i => i);
                const shifted = data.shift();

                const diff = Math.random();
                // add new value to the data
                if(Array.isArray(shifted)){
                    data.push([new Date(), diff])  
                }else{
                    if(typeof shifted === "object"){
                        data.push({xVal: new Date(), yVal: diff})  
                    }
                    if(typeof shifted === "number"){
                        data.push(diff)  
                    }
                }
                
                const newVolume = row.data.volume + (Math.floor(diff*1000))

                rowData.change = data;
                rowData.volume = newVolume;              
                gridRef.current.api.applyTransaction({ update: [rowData] });

            }, parseInt(interval.current.value))
        );
    }

      const stopFeed = ()=>{
          clearInterval(feedInterval);
          setFeedInterval(undefined);
      }

    useEffect(()=>{
        
        const options = {
                "lines" : lineSparklineOptions,
                "columns" : columnSparklineOptions,
                "area" : areaSparklineOptions,
                "bar" : barSparklineOptions
                }

        const baseOptions = getSparklinesOptions(options[sparkType], dataType);

        const myDummyOptions = {
            field: 'change',
            cellRenderer: 'agSparklineCellRenderer',
          }

        myDummyOptions.cellRendererParams = {"sparklineOptions" : baseOptions}

        setDummyOptions(myDummyOptions)

        const isRunning = feedInterval!==undefined;

        if(isRunning)
            stopFeed();

        setSparklinesOptions(myDummyOptions.cellRendererParams.sparklineOptions);

        if(isRunning)
          startFeed();

    },[sparkType, dataType])  

    const onGridReady = (params)=>{
        setGridApi(params.api);
    }

    return (
        <div style={{width: "100%"}}>
            <div>
                <button onClick={startFeed} disabled={feedInterval}>Start Feed</button>
                <input type="number" defaultValue="100" ref={interval} />
                <button onClick={stopFeed} disabled={!feedInterval}>Stop Feed</button>
            </div>
            <div>
                <span>Spark Chart Type:</span>
                <button onClick={()=>setSparkType("lines")} disabled={sparkType==="lines"}>Lines</button>
                <button onClick={()=>setSparkType("columns")} disabled={sparkType==="columns"}>Columns</button>
                <button onClick={()=>setSparkType("area")} disabled={sparkType==="area"}>Area</button>
                <button onClick={()=>setSparkType("bar")} disabled={sparkType==="bar"}>Bar</button>
            </div>

            <div>
                <span>Data Type:</span>
                <button onClick={()=>setDataType("numbers")} disabled={dataType==="numbers"}>Data Numbers</button>
                <button onClick={()=>setDataType("tuples")} disabled={dataType==="tuples"}>Data Tuples</button>
                <button onClick={()=>setDataType("objects")} disabled={dataType==="objects"}>Data Objects</button>
            </div>
            <div style={{display:"flex"}}>
                <div className="ag-theme-alpine" style={{flex:1, height:500}}>
                    <AgGridReact
                        ref={gridRef}
                        onGridReady = {onGridReady}
                        gridOptions={gridOptions}
                        rowData={rowData}
                        reactUi={true}
                    >
                    </AgGridReact>
                </div>
                <div style={{flex:1, paddingLeft:"2em"}}>
                    <details>
                        <summary>Sparklines ColumnDef</summary>
                        <pre>
                            <code>
                                {JSON.stringify(dummyOptions, null, 2)}
                            </code>
                        </pre>
                    </details>
                    <hr/>
                    <details>
                        <summary>Sample 'change' field data</summary>
                        <pre>
                            <code>
                                {rowData[0] && JSON.stringify(rowData[0].change, null, 2)}
                            </code>
                        </pre>
                    </details>
                </div>
            </div>
        </div>
    );

};

export default SparklinesGrid;