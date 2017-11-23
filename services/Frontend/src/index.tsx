import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from 'react-hot-loader';
import main from './main';
import { Site } from "uniserve.m8s.types"
import {
    BrowserRouter as Router
} from 'react-router-dom'


const render = (Component: any) => {
    ReactDOM.render(
        <Router>
            <AppContainer>
                <Component />
            </AppContainer>
        </Router>,
        document.getElementById("container")
    );
}

render(main);

// Webpack Hot Module Replacement API
if ((module as any).hot) {
    (module as any).hot.accept('./main', () => { render(require('./main').default) })
}