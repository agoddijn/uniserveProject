import * as React from "react";
import { TabularViewContainer } from "./components/TabularViewContainer";
import { MapContainer } from  "./components/MapContainer";

export default class main extends React.Component<any, {}> {
    constructor(props: any) {
        super(props);
    }
    render() {
        return <div>
            <TabularViewContainer Device={{}} />
            <MapContainer Device={{}} />
        </div>;
    }
}