import { AgGridReact } from 'ag-grid-react';
import React, { useMemo, useState } from 'react';

import {SliderGame} from './SliderGame'
import {UpDownButtonsHeader} from './UpDownButtonsHeader'
import {ControlButtons} from './ControlButtons'
import {LeftRightButtons} from './LeftRightButtons'

function GridSliderGame() {

    const [game, setGame] = useState(new SliderGame());
    const [rowData, setRowData] = useState(game.getDataAsRows());        

  
    const reorderGrid = (actionName, actionOn)=>{
        setRowData(game.movePieces(actionName, actionOn));
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

    const columnDefs = [    
        {
            headerName: 'controls',
            cellRendererFramework: LeftRightButtons,
            cellRendererParams: {actionCallBack: reorderGrid},
            pinned: 'left',
            colId: 'action',
            editable: false,
            maxWidth: 150,
            headerComponentFramework: ControlButtons, headerComponentParams:{actionCheckCallback: checkPuzzleDone, actionShuffle: shuffleData},
            cellClass: 'blank-tile'
        },
        {   
            field: 'pos1', 
            headerName: '1', 
            headerComponentFramework: UpDownButtonsHeader, 
            headerComponentParams:{actionCallBack: reorderGrid} },
        {   
            field: 'pos2', 
            headerName: '2',
            headerComponentFramework: UpDownButtonsHeader,
            headerComponentParams:{actionCallBack: reorderGrid} },
        {   
            field: 'pos3', 
            headerName: '3', 
            headerComponentFramework: UpDownButtonsHeader, 
            headerComponentParams:{actionCallBack: reorderGrid} },
    ];

    // never changes, so we can use useMemo
    const defaultColDef = useMemo( ()=> ({
        resizable: true,
        cellClass: params => {
        if (params.value === '') {
            return 'blank-tile';
        }
        return 'tile-cell';
    }    
    }), []);

    return (
        <AgGridReact 
            reactUi="true"
            className="ag-theme-alpine"
            animateRows="true"
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowData={rowData}
            rowHeight={80}
        />
    );
  }
  
  export {GridSliderGame}