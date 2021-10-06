function SliderGame(){

    this.baseGameData= ['1', '2', '3', '4', '5', '6', '7', '8', ''];

    this.MAX_NUMBER_OF_COLUMNS= 3;

    this.getGameData= ()=>{
      if(!this.gameData){
        this.gameData = Array.from(this.baseGameData);
      }
      return this.gameData;
    };

    this.shuffleData= () =>{

      let array = Array.from(this.baseGameData);
      const shuffled = [];
      while(array.length){
          const random = Math.floor(Math.random() * array.length);
          const pulled = array.splice(random, 1)[0];
          shuffled.push(pulled);
      }
      this.gameData=shuffled;
    };

    this.getDataAsRows = ()=>{
      let newRowData=[];
      
      let shuffled = Array.from(this.getGameData());
      for(let rowid=1; rowid<=3; rowid++){
        const row = {};
        for(let id=1; id<=this.MAX_NUMBER_OF_COLUMNS; id++){
          row['pos'+id]=shuffled.shift();
        }
        newRowData.push(row);
      }
      return newRowData;
    };

    this.isPuzzleDone = ()=>{

      let checkGameData = this.getGameData();
      for(let index=0;index<this.baseGameData.length; index++){
        if(this.baseGameData[index]!==checkGameData[index]){
          return false;
        }
      }

      return true;
    }

    // array of objects where each column is posX, where X is a number from 1 to X
    this.getRowsAsData= (rows)=>{
      const rowData = [];
      for(const row of rows){
        for(let index=1; index<=this.MAX_NUMBER_OF_COLUMNS; index++){
          rowData.push(row['pos' + index]);
        }
      }
      return rowData;
    }

    // rowIndex is 0 indexed, cellIndex is 1 indexed
    this.swapValues = (fromRowIndex, fromCellIndex, toRowIndex, toCellIndex)=>{

      const rows = this.getDataAsRows();

      const swapValue = rows[fromRowIndex]['pos'+fromCellIndex];
      rows[fromRowIndex]['pos'+fromCellIndex]=rows[toRowIndex]['pos'+toCellIndex];
      rows[toRowIndex]['pos'+toCellIndex]=swapValue;

      this.gameData = this.getRowsAsData(rows);
      return rows;
    }


    this.findRowWithValueInColumn = (aValue, searchColumnIndex, rowData) => {

      let hasGapInColumn = false;
      let rowIndex=0;
      for(const row of rowData){
        if(row['pos'+searchColumnIndex]===aValue){
          hasGapInColumn=true;
          break;
        }
        rowIndex++;
      }

      return {foundValue: hasGapInColumn, at: rowIndex}
    }

    this.findColumnWithValueInRow = (aValue, searchRowIndex, rowData) =>{
      let hasValueInRow = false;
      let colIndex=0;
      for(colIndex=1; colIndex<=this.MAX_NUMBER_OF_COLUMNS;colIndex++){
        if(rowData[searchRowIndex]['pos'+colIndex]===aValue){
          hasValueInRow=true;
          break;
        }
      }
      return {foundValue: hasValueInRow,  at: colIndex}
    }

    // up/down where actionOn is the column (1-X)
    // left/right where actionOn is the row(0-X)
    this.movePieces = (actionName, actionOn)=>{

        const amendRowData = this.getDataAsRows();

        if(actionName==="down"){
            const {foundValue, at} = this.findRowWithValueInColumn("", actionOn, amendRowData);

            if(foundValue && at!==0){
                return this.swapValues(at,actionOn, at-1, actionOn);
            }
        }

        if(actionName==="up"){
          const {foundValue, at} = this.findRowWithValueInColumn("", actionOn, amendRowData);
          
          if(foundValue && at!==amendRowData.length-1){
              return this.swapValues(at,actionOn, at+1, actionOn);
          }
        }

        if(actionName==="left"){
          const {foundValue, at} = this.findColumnWithValueInRow("", actionOn, amendRowData);
          
          if(foundValue && at!==this.MAX_NUMBER_OF_COLUMNS){
            return this.swapValues(actionOn,at, actionOn, at+1);          
          }
        }

        if(actionName==="right"){
          const {foundValue, at} = this.findColumnWithValueInRow("", actionOn, amendRowData);
          
          if(foundValue && at!==1){
            return this.swapValues(actionOn,at, actionOn, at-1);
          }
        }

        return amendRowData;
    }
}

export {SliderGame}