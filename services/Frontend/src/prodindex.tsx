import * as React from "react";
import * as ReactDOM from "react-dom";
import main from './main';

const render = (Component: any) => {
    ReactDOM.render(
        <Component />,
        document.getElementById("m8scontainer")
    );
}

render(main);

