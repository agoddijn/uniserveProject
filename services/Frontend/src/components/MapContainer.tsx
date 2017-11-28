import * as React from "react";
import { Site, Device } from "uniserve.m8s.types";
import { MarkerWrappers } from "./MarkerWrappers";
import { ColorMarkers } from "./ColorMarkersContainer";
const { compose, withProps, withHandlers } = require("recompose");
import IconButton from 'material-ui/IconButton';
import ViewModule from 'material-ui-icons/ViewModule';
import AspectRatio from 'material-ui-icons/AspectRatio';

const {
  withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow,
    OverlayView
} = require("react-google-maps");
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

export class MapContainer extends React.Component<{ Sites: Site[], SetLayout: any, SetSelectedSite: any, SelectedSite: Site, layoutupdate: boolean }, { Map: any, siteID: number }> {
    constructor(props: { Sites: Site[], SetLayout: any, SetSelectedSite: any, SelectedSite: Site, width: number, height: number, layoutupdate: boolean }) {
        super(props);
        this.state = {
            Map: <div></div>,
            siteID: this.props.SelectedSite? this.props.SelectedSite.site_recid: -1
        }
    }
    componentWillReceiveProps(next: { Sites: Site[], SelectedSite: Site, SetSelectedSite: any, layoutupdate: boolean }) {
        this._renderMap(next.Sites, next.SelectedSite.site_recid, next.SetSelectedSite, next.SelectedSite, next.layoutupdate);
        this.setState({siteID: next.SelectedSite.site_recid})
    }
    private Map;
    private updated: boolean = true;
    private _renderMap = (() => {
        let container = <div id={"newmap"} className={"container-inner"} style={{ height: "100%", width: "100%", position: "absolute" }}></div>
        let map = <div id={"newmapcontainer"} style={{ height: "95%", width: "100%" }}></div>;

        this.Map = withGoogleMap((props: { sites: Site[], markers: MarkerWrappers, SelectedSite: Site }) => {
            return (
                <GoogleMap
                    defaultZoom={8}
                    zoom={9}
                    defaultCenter={{ lat: Number(props.SelectedSite.latitude), lng: Number(props.SelectedSite.longitude) }}
                >
                    <MarkerClusterer
                        averageCenter
                        enableRetinaIcons
                        gridSize={60}
                        defaultMinimumClusterSize={3}
                        defaultZoomOnClick={true}>
                        {props.markers}
                    </MarkerClusterer>
                </GoogleMap>
            )
        });

        return function (sites: Site[], ID: number, SetSelectedSite: any, SelectedSite: Site, layout: boolean) {
            let Map_new = this.Map
            if ((layout && !this.update) || (SelectedSite && this.state.siteID != SelectedSite.site_recid)) {
                Map_new = withGoogleMap((props: { sites: Site[], markers: MarkerWrappers, SelectedSite: Site, this: any }) => {
                    return (
                        <GoogleMap
                            defaultZoom={8}
                            defaultCenter={{ lat: Number(props.SelectedSite.latitude), lng: Number(props.SelectedSite.longitude) }}
                            zoom={9}
                        >
                            <MarkerClusterer
                                averageCenter
                                enableRetinaIcons
                                gridSize={60}
                                defaultMinimumClusterSize={3}
                                defaultZoomOnClick={true}>
                                {props.markers}
                            </MarkerClusterer>
                        </GoogleMap>
                    )
                });
                this.update = true;
            } else {
                this.update = false;
            }
            let map_ele: any =
                <Map_new
                    sites={sites}
                    SelectedSite={SelectedSite}
                    containerElement={container}
                    mapElement={map}
                    markers={<MarkerWrappers
                        Sites={sites}
                        ClickedId={ID}
                        SetSelectedSite={SetSelectedSite}
                    />}
                />
            this.setState({ Map: map_ele });
        }
    })();

    render() {
        return <div className="myContainer">
            <div className={"container-bar"}>
                <h5 className={"title"}>
                    Map
                </h5>
                <IconButton onClick={this.props.SetLayout.bind(this, "fullmap")} className={"bar-button"}>
                    <AspectRatio style={{ color: "white" }} />
                </IconButton>
                <IconButton onClick={this.props.SetLayout.bind(this, "default")} className={"bar-button"}>
                    <ViewModule style={{ color: "white" }} />
                </IconButton>
            </div>
            {this.state.Map}
        </div>;
    }
}


