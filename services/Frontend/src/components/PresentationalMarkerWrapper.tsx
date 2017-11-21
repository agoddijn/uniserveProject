import * as React from "react";
import { Site, Device } from "uniserve.m8s.types";
import { MapIframeContainer } from "./MapIframeContainer"
import { DeviceTable } from "./DeviceTable"
// import { NewMapContainer } from "./NewMapContainer"
const { compose } = require("recompose");
const {
    Marker,
    InfoWindow
} = require("react-google-maps");

export class MarkerWrapper extends React.Component<{ Site: Site, display:boolean, SetSelectedSite:any }, { clicked:boolean }> {
    constructor(props: { Site: Site, display:boolean,SetSelectedSite:any }) {
        super(props);
        this.state = {
            clicked:this.props.display
        }
    }
    componentWillReceiveProps(next:{ Site: Site, display:boolean, SetSelectedSite:any }){
        this.setState(()=>{
            return {clicked: this.props.display}
        })
    }
    // this.setState({clicked:!this.state.clicked});
    render() {
        return <Marker key={this.props.Site.site_recid} position={{ lat: Number(this.props.Site.latitude), lng: Number(this.props.Site.longitude) }} onClick={() => { this.props.SetSelectedSite(this.props.Site.site_recid); this.setState({clicked:!this.state.clicked});}} >
                    {this.props.Site.devices.length!==0 && this.state.clicked && <InfoWindow  onClick={()=>{this.setState({clicked:!this.state.clicked})}}><div style={{width:"22vw", height:"14vh"}}><DeviceTable devices={this.props.Site.devices}/></div></InfoWindow>}
                </Marker>
    }
}