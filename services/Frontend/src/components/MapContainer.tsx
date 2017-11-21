import * as React from "react";
import { Site, Device } from "uniserve.m8s.types";
import { MarkerWrappers } from "./MarkerWrappers";
const { compose } = require("recompose");
import IconButton from 'material-ui/IconButton';
import ViewModule from 'material-ui-icons/ViewModule';
import AspectRatio from 'material-ui-icons/AspectRatio';


const {
  withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
} = require("react-google-maps");
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

export class MapContainer extends React.Component<{ Sites: Site[], SetLayout: any, SetSelectedSite:any, SelectedSite:Site }, { Map: any }> {
    constructor(props: { Sites: Site[], SetLayout: any, SetSelectedSite:any,SelectedSite:Site }) {
        super(props);
        this.state = {
            Map: <div></div>
        }
    }
    componentWillReceiveProps(next: { Sites: Site[], SelectedSite:Site,SetSelectedSite:any }) {
        this._renderMap(next.Sites, next.SelectedSite.site_recid,next.SetSelectedSite);
    }

    private _renderMap = (() => {
        let container = <div className={"container-inner"} style={{width: "100%", position: "absolute"}}></div>
        let map = <div style={{ height: "100%", width: "100%" }}></div>;
        let Map = withGoogleMap((props: {markers:MarkerWrappers}) => {
            return (
                <GoogleMap defaultZoom={11} defaultCenter={{ lat: 49.2648641, lng: -123.2536411 }}>
                    <MarkerClusterer 
                        averageCenter
                        enableRetinaIcons
                        gridSize={60}
                        defaultMinimumClusterSize={2}
                        defaultZoomOnClick={true}>
                        {props.markers}
                    </MarkerClusterer>
                </GoogleMap>
            )
        });
        return function(sites: Site[],ID:number,SetSelectedSite:any) {
            let map_ele: any = <Map containerElement={container} mapElement={map} markers={<MarkerWrappers Sites={sites} ClickedId={ID} SetSelectedSite={SetSelectedSite} />}/>
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
                    <AspectRatio style={{color: "white"}}/>
                </IconButton>
                <IconButton onClick={this.props.SetLayout.bind(this, "default")} className={"bar-button"}>
                    <ViewModule style={{color: "white"}}/>
                </IconButton>
            </div>
            {this.state.Map}
        </div>;
    }
}


