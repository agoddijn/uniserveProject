import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from 'react-hot-loader';
import main from './main';
import { Site } from "../../../modules/common_types/types/Site"


const render = (Component: any) => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        document.getElementById("container")
    );
}
console.log('sth');
render(main);

// Webpack Hot Module Replacement API
if ((module as any).hot) {
    (module as any).hot.accept('./main', () => { render(require('./main').default) })
}