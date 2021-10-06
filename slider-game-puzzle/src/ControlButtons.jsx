const ControlButtons = (props) => {

    const onCheck = ()=> {
        props.actionCheckCallback();
    };
  
    const onShuffle = ()=> {
      props.actionShuffle();
    };
  
    return (
        <div style={{'width':'100%', 'textAlign':'center'}}>
            <span className="control-buttons" style={{'fontSize':'2em'}}>
                <button name="check" onClick={onCheck}>Done?</button> &nbsp;
                <button name="shuffle" onClick={onShuffle}>@</button>
            </span>
        </div>
    );
  };

export {ControlButtons}  