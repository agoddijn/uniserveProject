import * as React from "react";
import { Device } from "../../commonTypes/Device";
import { ContainerBar } from "./PresentationalContainerBar"

export class MapContainer extends React.Component<any, {}> {
    constructor(props: any) {
        super(props);
    }
    render() {
        return <div id="mapcontainer">
            <ContainerBar Title={"Map"} />
        </div>;
    }
}