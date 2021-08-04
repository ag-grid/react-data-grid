import React, { Component } from 'react';

export class RangeFilter extends Component {
    constructor(props) {
        super(props);

        this.input = React.createRef();

        this.state = {
            filter: ''
        };

        this.valueGetter = this.props.valueGetter;

        this.onSubmit = this.onSubmit.bind(this);
    }

    isFilterActive() {
        return this.state.filter !== '';
    }

    doesFilterPass(params) {
        const filter = this.state.filter.split('-');
        const gt = Number(filter[0]);
        const lt = Number(filter[1]);
        const value = this.valueGetter(params.node);

        return value >= gt && value <= lt;
    }

    getModel() {
        return {filter: this.state.filter};
    }

    setModel(model) {
        const filter = model ? model.filter : '';
        this.setState({filter: filter});
    }

    afterGuiAttached(params) {
        this.input.current.focus();
    }

    onSubmit(event) {
        event.preventDefault();

        let filter = event.target.elements.filter.value;

        if (this.state.filter !== filter) {
            this.setState({filter: filter}, () => {
                this.props.filterChangedCallback();
            });
        }
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <input name="filter" ref={this.input} defaultValue={this.state.filter}/>
                <button>Apply</button>
            </form>
        );
    }
}