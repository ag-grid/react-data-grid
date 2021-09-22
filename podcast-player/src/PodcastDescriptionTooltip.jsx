import React, { forwardRef, useImperativeHandle, useState } from 'react';

export default forwardRef((props, ref) => {
    const [data, setData] = useState(props.api.getDisplayedRowAtIndex(props.rowIndex).data);
  
    useImperativeHandle(ref, () => {
        return {
            getReactContainerClasses() {
                return ['custom-tooltip'];
            }
        }
    });
  
    return (        
        <div className="custom-tooltip">
            <p>{data.title}</p>
            <p>{data.description}</p>
        </div>
    );
  });