import React, { useState, forwardRef, useRef, useImperativeHandle, setState, useCallback, useEffect } from 'react';

export const RangeFilter = forwardRef((props, ref) => {

    const [filter, setFilter] = useState('');
    const input =  useRef(null);

    useImperativeHandle(ref, () => {
        return {
            isFilterActive() {
                return filter !== '';
            },

            doesFilterPass(params) {
                const myfilter = filter.split('-');

                const gt = Number(myfilter[0]);
                const lt = Number(myfilter[1]);
                const value = params.node.data.price;
        
                return value >= gt && value <= lt;
            },
        
            getModel() {
                return {filter: filter};
            },

            setModel(model) {
                const filter = model ? model.filter : '';
                setState( filter);
            }
    
        };
    });


    useEffect(() => {
        props.filterChangedCallback()
    }, [filter]);


    useEffect( ()=> input.current.focus(), []);

    const onSubmit = useCallback( event => {
        event.preventDefault();

        let currFilter = event.target.elements.filter.value;

        if (filter !== currFilter) {
            setFilter( currFilter);
        }
    });

    return (
        <form onSubmit={onSubmit}>
            <input name="filter" ref={input} defaultValue={filter}/>
            <button>Apply</button>
        </form>
    );

});