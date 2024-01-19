import { useGridFilter } from "ag-grid-react";
import React, { useCallback } from "react";

export default ({model, onModelChange, getValue, colDef, title}) => {

    const valueChanged = useCallback( p => {
        const newValue = p.target.value;
        onModelChange(newValue == '' ? null : newValue);
    });

    const doesFilterPass = useCallback( ({data, node}) => {
        const value = getValue(node);
        return value == model;
    });

    useGridFilter({doesFilterPass});

    return <>
        <div>
            <h3>{title}</h3>
            <input
                type="text"
                value={model || ''}
                onChange={valueChanged}
                />
        </div>
    </>;
};