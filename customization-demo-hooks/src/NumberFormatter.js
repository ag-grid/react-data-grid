import React, { Component } from 'react';

export function NumberFormatter(props){

        const value = Number(props.value);
        const text = value.toLocaleString(undefined, {style: 'currency', currency: 'EUR'});

        return (
            <span>{text}</span>
        );    
}