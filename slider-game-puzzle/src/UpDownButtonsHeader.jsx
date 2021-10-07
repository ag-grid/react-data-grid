
const UpDownButtonsHeader = (props) => {

    const onClick = (e)=> {
        props.actionCallBack(e.target.name, props.column.instanceId-1);
    };

    return (
        <div className="header-buttons-outer">
            <span className="header-buttons">            
                <button name="up" onClick={onClick}>^</button> &nbsp;
                <button name="down" onClick={onClick}>v</button>
            </span>
        </div>
    );
};

export {UpDownButtonsHeader}