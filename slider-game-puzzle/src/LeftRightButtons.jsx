const LeftRightButtons = (props)=>{

    const onClick = (e)=> {
        props.actionCallBack(e.target.name, props.rowIndex);
    };
  
    return (
        <div style={{'textAlign':'center'}}>
        <span style={{'fontSize':'4em'}}>
            <button name="left" onClick={onClick}>&lt;</button> &nbsp;
            <button name="right" onClick={onClick}>&gt;</button>
        </span>
      </div>
    );
  }

  export {LeftRightButtons}