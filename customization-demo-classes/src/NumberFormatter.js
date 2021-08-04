import React, { Component } from 'react';

export class NumberFormatter extends Component {
    render() {
        const value = Number(this.props.value);
        const text = value.toLocaleString(undefined, {style: 'currency', currency: 'EUR'});

        return (
            <span>{text}</span>
        )
    }
}