// helper method to find a row id and cell named in that row
const getRowCellNamed = (rowId, cellName)=>{
    return document.querySelector(`.ag-row[row-id="${rowId}"] .ag-cell[col-id="${cellName}"]`); // .ag-cell-value
  }
  
  // given a cell, get the value of the cell
const getCellValue = (cell)=>{
    return cell.querySelector(".ag-cell-value");
}
  
const findFirstContainerElementWithClass = (anElement, findClassName)=>{
    const parent= anElement.parentNode;
    const classes = parent.className.split(" ");
    if(classes.includes(findClassName)){
      return parent;
    }
  
    if(classes.includes("ag-root-wrapper")){
      // hit edge of grid, go no further
      return undefined;
    }
  
    return findFirstContainerElementWithClass(parent, findClassName);
}
  
  
const getNamedCellsWithValues = (cellName, cellValue)=>{
    const cells = Array.from(document.querySelectorAll(`.ag-cell[col-id="${cellName}"]`));
    return cells.filter(cell => getCellValue(cell).textContent==cellValue);
}
  
const getRowWithNamedCellValue = (cellName, cellValue)=>{
    const cells = getNamedCellsWithValues(cellName, cellValue);
    for(const cell of cells){
      if(getCellValue(cell).textContent==cellValue){
        return findFirstContainerElementWithClass(cell, "ag-row");
      }
    }
    return undefined;
}

export{
    getRowWithNamedCellValue, 
    getNamedCellsWithValues, 
    findFirstContainerElementWithClass, 
    getCellValue, 
    getRowCellNamed};