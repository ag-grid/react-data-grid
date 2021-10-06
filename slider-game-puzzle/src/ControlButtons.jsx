const ControlButtons = (props) => {

    const onCheck = ()=> {
        props.actionCheckCallback();
    };
  
    const onShuffle = ()=> {
      props.actionShuffle();
    };
  
    return (
        <div className="header-buttons-outer">
            <span className="header-buttons">
                <button name="check" onClick={onCheck}>Done?</button> &nbsp;
                <button name="shuffle" onClick={onShuffle}>@</button>
            </span>
        </div>
    );
  };

export {ControlButtons}  