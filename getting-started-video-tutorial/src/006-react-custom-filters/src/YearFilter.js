
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from 'react';

export default forwardRef( (props, ref) => {

    const [filterState, setFilterState] = useState('off');

    useImperativeHandle(ref, ()=> {
        return {
            isFilterActive() {
                return filterState!='off';
            },
            doesFilterPass(params) {
                const field = props.colDef.field;
                return params.data[field] == filterState;
            },
            getModel() {
                if (filterState=='off') { 
                    return undefined;
                }
                return {
                    state: filterState
                }
            },
            setModel(model) {
                if (model==null) {
                    setFilterState('off');
                } else {
                    setFilterState(model.state);
                }
            },
            getModelAsString() {
                return filterState=='off' ?
                        '' : filterState;
            },
            onNewRowsLoaded() {
                console.log('new rows were loaded');
            },
            onAnyFilterChanged() {
                console.log('another filter was changed');
            },
            afterGuiAttached() {
                console.log('focus something???');
            }
        };
    });

    useEffect( ()=> {
        console.log(props.title + ' filter created');
        return ()=> console.log(
                    props.title + ' filter destroyed');
    }, []);

    useEffect( ()=> props.filterChangedCallback(), 
                [filterState]);

    return (
        <>
            <div className='filter-title'>{props.title}</div>
            <div className='filter-state'>
                State = {filterState}
            </div>
            <div className='filter-entry'>
                <button 
                    onClick={()=>setFilterState('off')}>
                        Off
                </button>
            </div>
            { props.values.map( value => (
                <div key={value} className='filter-entry'>
                    <button 
                        onClick={()=>setFilterState(value)}>
                            {value}
                    </button>
                </div>
            )) }
        </>
    );
});