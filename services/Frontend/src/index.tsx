import * as React from "react";
import * as ReactDOM from "react-dom";

import { TabularViewContainer } from "./components/TabularViewContainer";
import { MapContainer } from  "./components/MapContainer";

ReactDOM.render(
    (<div>
         <TabularViewContainer Device={{}} />
         <MapContainer Device={{}} />
    </div>),
    document.getElementById("container")
);
