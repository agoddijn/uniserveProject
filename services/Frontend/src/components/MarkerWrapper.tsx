import * as React from "react";
import { Site, Device } from "uniserve.m8s.types";
import { ContainerBar } from "./PresentationalContainerBar"
import { MapIframeContainer } from "./MapIframeContainer"
import { DeviceBody } from "./PresentationalDeviceBody"
// import { NewMapContainer } from "./NewMapContainer"
const { compose } = require("recompose");
const {
    Marker,
    InfoWindow
} = require("react-google-maps");

export class MarkerWrapper extends React.Component<{ Site: Site, num:number, info:any }, { clicked:boolean }> {
    constructor(props: { Site: Site, num:number, info:any }) {
        super(props);
        this.state = {
            clicked:false
        }
    }
    render() {
        return <Marker key={this.props.num} position={{ lat: this.props.Site.latitude, lng: this.props.Site.longitude }} onClick={() => {this.setState({clicked:!this.state.clicked})}} >
                    {this.props.Site.devices.length!==0 && this.state.clicked && <InfoWindow onClick={()=>{this.setState({clicked:!this.state.clicked})}}><div ><DeviceBody Devices={this.props.Site.devices} tabular={false} display={true} num={this.props.num}/></div></InfoWindow>}
                </Marker>
    }
}