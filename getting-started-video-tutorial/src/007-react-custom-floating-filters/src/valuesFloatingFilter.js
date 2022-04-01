
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from 'react';

export default forwardRef( (props, ref) => {

    const [value, setValue] = useState();

    const allValues = props.filterParams.values;

    useEffect( ()=> {
        console.log('Floating Filter Created');
        return ()=> console.log('Floating Filter Destroyed');
    }, []);

    useImperativeHandle(ref, ()=> {
        return {
            onParentModelChanged(parentModel) {
                if (parentModel) {
                    setValue(parentModel.state);
                } else {
                    setValue();
                }
            }
        };
    });

    const clickListener = useCallback( value => {
        props.parentFilterInstance( instance => {
            instance.setValue(value);
        }, []);
    }, []);

    return (
        <div>
            <div>
                <button onClick={()=>clickListener('off')}>
                    Off
                </button>
                { allValues.map( 
                    value =>
                        <button key={value} onClick={()=>clickListener(value)}>
                            {value}
                        </button>
                ) }
            </div>
            <div>{value}</div>
        </div>
    );
});
