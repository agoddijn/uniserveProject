import * as React from "react";
import { Site, Device } from "uniserve.m8s.types";
import { MapIframeContainer } from "./MapIframeContainer"
import { DeviceTable } from "./DeviceTable"
const { compose } = require("recompose");
const {
    Marker,
    InfoWindow
} = require("react-google-maps");


export class MarkerWrapper extends React.Component<{ Site: Site, clicked: number, SetSelectedSite: any }, { site: Site, display: boolean, closed: boolean}> {
    constructor(props: { Site: Site, clicked: number, SetSelectedSite: any }) {
        super(props);
        this.state = {
            site: this.props.Site,
            display: this.props.clicked == this.props.Site.site_recid,
            closed: false
        }
    }
    componentWillReceiveProps(next: { Site: Site, clicked: number, SetSelectedSite: any }) {
        let closed = this.state.closed;
        if (this.props.Site.site_recid != this.props.clicked) closed = false;
        this.setState({ 
            display: (next.clicked == next.Site.site_recid &&
                !closed), 
            site: next.Site,
            closed: closed})
    }
    handleCloseClick(){
        this.setState({display: false, closed: true});
    }
    handleClick(){
        this.setState({display: true, closed: false});
        this.props.SetSelectedSite(this.props.Site.site_recid);
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
        let table = 
            <div style={{ width: "22vw", height: "14vh" }}>
                <p>Site: {this.state.site.site_recid} - {this.state.site.description}</p>
                <DeviceTable devices={this.state.site.devices} />
            </div>;
        return <Marker 
            key={this.props.Site.site_recid} 
            position={{ lat: Number(this.props.Site.latitude), 
            lng: Number(this.props.Site.longitude) }} 
            onClick={this.handleClick.bind(this)} 
            icon={path}>
            {this.state.display && this.state.site.devices.length > 0 &&
                <InfoWindow
                    onCloseClick={this.handleCloseClick.bind(this)}>
                    {table}
                </InfoWindow>
            }
        </Marker>
    }
}
