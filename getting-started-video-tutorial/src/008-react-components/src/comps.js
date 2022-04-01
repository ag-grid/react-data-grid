
import {Component} from 'react';

export const HelloComp = p => {
    return <>Hello {p.name}!</>;
};

export class GoodbyeComp extends Component {
    render() {
        return <>Goodbye {this.props.name}!</>;
    }
}

export class GreetJSComp {
    init(p) {
        this.eGui = document.createElement('span');
        this.eGui.innerHTML = 'GreetJS ' + p.name;
    }
    getGui() {
        return this.eGui;
    }
}