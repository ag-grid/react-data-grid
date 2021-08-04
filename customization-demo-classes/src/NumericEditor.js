import React, { Component } from 'react';

export class NumericCellEditor extends Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
    }

    onKeyPress(event) {
        if (!isNumeric(event.nativeEvent)) {
            event.preventDefault();
        }

        function isNumeric(event) {
            return /\d/.test(event.key);
        }
    }

    onKeyDown(event) {
        if (event.keyCode === 39 || event.keyCode === 37) {
            event.stopPropagation();
        }
    }

    afterGuiAttached() {
        if (this.textInput) this.textInput.current.focus();
    };

    getValue() {
        return this.textInput.current.value;
    };

    componentDidMount() {
        this.textInput.current.addEventListener('keydown', this.onKeyDown);
    }

    render() {
        return (
            <input onKeyPress={this.onKeyPress} ref={this.textInput} defaultValue={this.props.value}/>
        );
    }
}