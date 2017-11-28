import * as React from "react";
import { Site, Device } from "uniserve.m8s.types";
const {
    OverlayView
} = require("react-google-maps");


export class ColorMarkers extends React.Component<{ Sites: Site[] }, { Sites: any }> {
    constructor(props: { Sites: Site[] }) {
        super(props);
    }
    componentWillReceiveProps(next: { Sites: Site[] }) {
        this.setState({ Sites: next.Sites })
    }
    getPixelPositionOffset = (width, height) => ({
        x: -(width / 2),
        y: -(height / 2) + 10,
    })
    render() {
        return (this.state.Sites.map((s: Site) => {
            return <OverlayView position={{ lat: Number(s.latitude), lng: Number(s.longitude) }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} getPixelPositionOffset={this.getPixelPositionOffset}>
                <div></div>
            </OverlayView>
        }))
    }
}
{/* <ColorMarker Devices={this.props.Site.devices} /> */ }