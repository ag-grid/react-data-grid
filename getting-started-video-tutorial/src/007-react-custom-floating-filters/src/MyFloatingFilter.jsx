import React, { useCallback, useEffect } from "react";

export default ({model, onModelChange, getValue}) => {

    const valueChanged = useCallback( p => {
        const newValue = p.target.value;
        onModelChange(newValue == '' ? null : newValue);
    });

    useEffect( ()=> {
        console.log('Floating Filter Created');
        return () => console.log('Floating Filter Destroyed');
    }, []);

    return <>
        <div className="MyFloatingFilter">
            <input
                className="MyFloatingFilterInput"
                type="text"
                value={model || ''}
                onChange={valueChanged}
                />
        </div>
    </>;
};