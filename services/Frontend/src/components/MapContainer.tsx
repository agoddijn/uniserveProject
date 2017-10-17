import * as React from "react";
import { Device } from "uniserve.m8s.types";
import { ContainerBar } from "./PresentationalContainerBar"
import { MapIframeContainer} from "./MapIframeContainer"

export class MapContainer extends React.Component<any, {}> {
    constructor(props: any) {
        super(props);
    }
    render() {
        return <div id="mapcontainer">
            <ContainerBar Title={"Map"} />
            <MapIframeContainer />
        </div>;
    }
}