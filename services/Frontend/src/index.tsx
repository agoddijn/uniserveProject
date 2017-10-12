import * as React from "react";
import * as ReactDOM from "react-dom";

import { ListContainer } from "./components/ListContainer";
import { MapContainer } from  "./components/MapContainer";

ReactDOM.render(
    (<div>
         <ListContainer Device={{}} />
         <MapContainer Device={{}} />
    </div>),
    document.getElementById("container")
);
