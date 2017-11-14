import * as React from "react";
import { Site, Device } from "uniserve.m8s.types";
import { ContainerBar } from "./PresentationalContainerBar"
import { MapIframeContainer } from "./MapIframeContainer"
import { DeviceBody } from "./PresentationalDeviceBody"
import { MarkerWrapper } from "./MarkerWrapper"
const { compose } = require("recompose");
const {
  withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
} = require("react-google-maps");
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

export class MapContainer extends React.Component<{ Sites: Site[] }, { Map: any }> {
    constructor(props: any) {
        super(props);
        this.state = {
            Map: <div></div>
        }
    }
    componentWillReceiveProps(next: { Sites: Site[] }) {
        let Map: any = withGoogleMap((props: any) => {
            return (
                <GoogleMap defaultZoom={11} defaultCenter={{ lat: 49.2648641, lng: -123.2536411 }}>
                    <MarkerClusterer 
                        averageCenter
                        enableRetinaIcons
                        gridSize={60}
                        defaultMinimumClusterSize={2}
                        defaultZoomOnClick={true}>
                        {next.Sites.map((s: Site, key: number) => {
                            return <MarkerWrapper Site={s} num={key} info={props} />
                        })}
                    </MarkerClusterer>
                </GoogleMap>
            )
        })
        let map_ele: any = <Map containerElement={<div className={"container-inner"} style={{ height: "100%", width: "100%" }}></div>} mapElement={<div style={{ height: "100%", width: "100%" }}></div>} />
        this.setState({ Map: map_ele });
    }
    render() {
        return <div className="myContainer">
            <div className={"container-bar"}>
                <h5 className={"title"}>
                    Map
                </h5>
            </div>
            {this.state.Map}
        </div>;
    }
}