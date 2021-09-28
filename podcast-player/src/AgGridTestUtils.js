import {waitFor} from '@testing-library/react'

// TODO: create parent div reference to handle multiple grids on a page
// Synchronisation

const waitForGridToBeInTheDOM=()=>{
    return waitFor(() => {
      expect(document.querySelector(".ag-root-wrapper")).toBeInTheDocument();
    });
  }



const waitForPagination=()=>{

   return new Promise((resolve, reject)=>{

    let paginationPanel = undefined;

    waitFor(() => {
      paginationPanel = document.querySelector(".ag-paging-panel");  
      expect(paginationPanel).toBeInTheDocument();}).then(()=>{
        const panelId = paginationPanel.getAttribute("id");
        const panelData = {panelId: panelId};
    
        panelData.firstRow = document.querySelector(`#${panelId}-first-row`).textContent;
        panelData.lastRow = document.querySelector(`#${panelId}-last-row`).textContent;
        panelData.rowCount = document.querySelector(`#${panelId}-row-count`).textContent;
        resolve(panelData);
      }).catch((err)=>reject(err))
  
  
   });
}



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

    waitForGridToBeInTheDOM,
    waitForPagination,

    getRowWithNamedCellValue, 
    getNamedCellsWithValues, 
    findFirstContainerElementWithClass, 
    getCellValue, 
    getRowCellNamed};