import './game.css';
import { AgGridReact } from 'ag-grid-react';
import React, { useEffect, useState } from 'react';

import {SliderGame} from './SliderGame'
import {UpDownButtonsHeader} from './UpDownButtonsHeader'
import {ControlButtons} from './ControlButtons'
import {LeftRightButtons} from './LeftRightButtons'

function GridSliderGame() {

    const [game, setGame] = useState();
    const [rowData, setRowData] = useState([]);        

  
    useEffect(()=>{
        const aGame = new SliderGame();
        setGame(aGame);
        setRowData(aGame.getDataAsRows())
    }
    ,[]);

    const reorderGrid = (actionName, actionOn)=>{
        setRowData(game?.movePieces(actionName, actionOn));
    } 
  
    const shuffleData = ()=>{
        game.shuffleData();
        setRowData(game.getDataAsRows());
    }

    const checkPuzzleDone = ()=>{
        if(game.isPuzzleDone()){
            alert("Puzzle complete, well done!");
        }else{
            alert("Sorry, not done yet");
        }
    }

    const blankOrNumberTile = (params)=> {
        return params.value === '' ? 'blank-tile' : 'tile-cell';
    };

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
        {   
            field: 'pos1', 
            headerComponent: UpDownButtonsHeader, 
            headerComponentParams:{actionCallBack: reorderGrid},
            cellClass: blankOrNumberTile
        },
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
    ];

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
  }
  
  export {GridSliderGame}