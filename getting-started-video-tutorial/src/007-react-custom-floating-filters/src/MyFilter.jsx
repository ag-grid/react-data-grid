import { useGridFilter } from "ag-grid-react";
import React, { useCallback, useEffect } from "react";

export default ({model, onModelChange, getValue}) => {

    const valueChanged = useCallback( p => {
        const newValue = p.target.value;
        onModelChange(newValue == '' ? null : newValue);
    });

    const doesFilterPass = useCallback( ({node}) => {
        const value = getValue(node);
        return value == model;
    });

    const getModelAsString = useCallback( ()=> {
        return model;
    }, [model]);

    useGridFilter({doesFilterPass, getModelAsString});

    useEffect( ()=> {
        console.log('Filter Created');
        return () => console.log('Filter Destroyed');
    }, []);

    return <>
        <div className="MyFilter">
            Filter:
            <input
                className="MyFilterInput"
                type="text"
                value={model || ''}
                onChange={valueChanged}
                />
        </div>
    </>;
};