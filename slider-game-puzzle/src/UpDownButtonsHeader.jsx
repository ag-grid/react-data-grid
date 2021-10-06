
const UpDownButtonsHeader = (props) => {

    const onClick = (e)=> {
        props.actionCallBack(e.target.name, props.column.instanceId);
    };

    // { props.displayName }&nbsp;
    return (
        <div style={{'width':'100%', 'textAlign':'center'}}>
            <span className="up-down-buttons" style={{'fontSize':'2em'}}>            
                <button name="up" onClick={onClick}>^</button> &nbsp;
                <button name="down" onClick={onClick}>v</button>
            </span>
        </div>
    );
};

export {UpDownButtonsHeader}