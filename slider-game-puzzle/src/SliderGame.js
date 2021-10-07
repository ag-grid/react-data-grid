function SliderGame(){

    this.baseGameData= ['1', '2', '3', '4', '5', '6', '7', '8', ''];

    this.NUMBER_OF_COLUMNS= 3;
    this.NUMBER_OF_ROWS= 3;

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

    // internally we represent it as a linear array, the grid uses
    // an x*y array with columns 1-3
    this.getDataAsRows = ()=>{
      let newRowData=[];
      
      let shuffled = Array.from(this.getGameData());
      for(let rowid=0; rowid<this.NUMBER_OF_ROWS; rowid++){
        const row = {};
        for(let id=0; id<this.NUMBER_OF_COLUMNS; id++){
          row['pos'+(id+1)]=shuffled.shift();
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

    // in string rowXcol  == positionInString (row*NUMBER_OF_COLUMNS)+col
    this.convertFromCoOrdsToLinearPosition = (row, col)=>{
      return (row*this.NUMBER_OF_COLUMNS)+col;
    }

    // rowIndex is 0 indexed, cellIndex is 0 indexed
    this.linearSwapValues = (fromRowIndex, fromCellIndex, toRowIndex, toCellIndex)=>{

      const rows = this.getGameData();

      const fromPosition = this.convertFromCoOrdsToLinearPosition(fromRowIndex, fromCellIndex);
      const toPosition = this.convertFromCoOrdsToLinearPosition(toRowIndex, toCellIndex);

      if(fromPosition >= rows.length || toPosition >= rows.length){
        return rows;
      }

      if(fromPosition < 0 || toPosition < 0){
        return rows;
      }


      const swapValue = rows[fromPosition];
      rows[fromPosition] = rows[toPosition];
      rows[toPosition] = swapValue;

      return rows;
    }


    this.findRowWithValueInColumn = (aValue, searchColumnIndex, searchGameData) => {

      let hasGapInColumn = false;
      let rowIndex=0;
      for(; rowIndex< this.NUMBER_OF_ROWS; rowIndex++){
        if(searchGameData[this.convertFromCoOrdsToLinearPosition(rowIndex, searchColumnIndex)]===aValue){
          hasGapInColumn=true;
          break;
        }
      }

      return {foundValue: hasGapInColumn, at: rowIndex}
    }

    this.findColumnWithValueInRow = (aValue, searchRowIndex, searchGameData) =>{
      let hasValueInRow = false;
      let colIndex=0;
      for(; colIndex<this.NUMBER_OF_COLUMNS;colIndex++){
        if(searchGameData[this.convertFromCoOrdsToLinearPosition(searchRowIndex, colIndex)]===aValue){
          hasValueInRow=true;
          break;
        }
      }
      return {foundValue: hasValueInRow,  at: colIndex}
    }

    // up/down where actionOn is the column (0-X)
    // left/right where actionOn is the row(0-X)
    this.movePieces = (actionName, actionOn)=>{

        if(actionName==="down"){
            const {foundValue, at} = this.findRowWithValueInColumn("", actionOn, this.getGameData());

            if(foundValue && at!==0){
                this.gameData = this.linearSwapValues(at,actionOn, at-1, actionOn);                
            }
        }

        if(actionName==="up"){
          const {foundValue, at} = this.findRowWithValueInColumn("", actionOn, this.getGameData());
          
          if(foundValue && at<this.NUMBER_OF_ROWS){
              this.gameData = this.linearSwapValues(at,actionOn, at+1, actionOn);    
          }
        }

        if(actionName==="left"){
          const {foundValue, at} = this.findColumnWithValueInRow("", actionOn, this.getGameData());
          
          if(foundValue && at<this.NUMBER_OF_COLUMNS){
            this.gameData = this.linearSwapValues(actionOn,at, actionOn, at+1);        
          }
        }

        if(actionName==="right"){
          const {foundValue, at} = this.findColumnWithValueInRow("", actionOn, this.getGameData());
          
          if(foundValue && at!==0){
            this.gameData = this.linearSwapValues(actionOn,at-1, actionOn, at);   
          }
        }

        return this.getDataAsRows()
    }
}

export {SliderGame}