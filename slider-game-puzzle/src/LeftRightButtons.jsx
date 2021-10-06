const LeftRightButtons = (props)=>{

    const onClick = (e)=> {
        props.actionCallBack(e.target.name, props.rowIndex);
    };
  
    return (
        <div className="cell-buttons-outer">
          <span className="cell-buttons">
              <button name="left" onClick={onClick}>&lt;</button> &nbsp;
              <button name="right" onClick={onClick}>&gt;</button>
          </span>
      </div>
    );
  }

  export {LeftRightButtons}