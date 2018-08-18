import React from 'react'
import Store from 'store'

import View from './abstract/View'
import Navigation from '../components/Navigation'

class App extends View {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="app">
            <Navigation />
            <div className="content">
                {this.props.children}
            </div>
        </div>;
    }

}

export default App;
