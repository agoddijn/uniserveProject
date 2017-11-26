import * as React from "react";
import { Site, Device } from "uniserve.m8s.types";
import { MapIframeContainer } from "./MapIframeContainer"
import { DeviceTable } from "./DeviceTable"
const { compose } = require("recompose");
const {
    Marker,
    InfoWindow
} = require("react-google-maps");


export class MarkerWrapper extends React.Component<{ Site: Site, display: boolean, SetSelectedSite: any }, { table: any, clicked: boolean }> {
    constructor(props: { Site: Site, display: boolean, SetSelectedSite: any }) {
        super(props);
        this.state = {
            table:
                <div style={{ width: "22vw", height: "14vh" }}>
                    <p>Site: {this.props.Site.site_recid} - {this.props.Site.description}</p>
                    <DeviceTable devices={this.props.Site.devices} />
                </div>,
            clicked: this.props.display
        }
    }
    componentWillReceiveProps(next: { Site: Site, display: boolean, SetSelectedSite: any }) {
        this.setState({ clicked: next.display })
    }
    render() {
        var status = "pin-green", pings = 0, unresponsive = 0, avResponse = 0;
        for (let device of this.props.Site.devices) {
            for (let record of device.ping_records) {
                pings += 1;
                if (!record.responded) unresponsive += 1;
                avResponse += record.ms_response;
            }
        }
        avResponse = Math.round(avResponse / (pings - unresponsive));
        if (unresponsive > 0 || pings == 0) {
            status = "pin-orange";
            if (unresponsive == pings) status = "pin-red";
        }
        let path = '/images/m8s/'+status+'.svg'
        
        return <Marker 
            key={this.props.Site.site_recid} 
            position={{ lat: Number(this.props.Site.latitude), 
            lng: Number(this.props.Site.longitude) }} 
            onClick={() => { this.props.SetSelectedSite(this.props.Site.site_recid); }} 
            icon={path}>
            {this.state.clicked && this.props.Site.devices.length !== 0 &&
                <InfoWindow>
                    {this.state.table}
                </InfoWindow>
            }
        </Marker>
    }
}
