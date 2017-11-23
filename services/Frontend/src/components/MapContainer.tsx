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

export class MapContainer extends React.Component<{ Sites: Site[], SetLayout: any, SetSelectedSite:any, SelectedSite:Site,layoutupdate:boolean }, { Map: any}> {
    constructor(props: { Sites: Site[], SetLayout: any, SetSelectedSite:any,SelectedSite:Site,width:number,height:number,layoutupdate:boolean }) {
        super(props);
        this.state = {
            Map: <div></div>,
        }
    }
    componentWillReceiveProps(next: { Sites: Site[], SelectedSite:Site,SetSelectedSite:any,layoutupdate:boolean }) {
        if (next.Sites.length > 0)
        this._renderMap(next.Sites, next.SelectedSite? next.SelectedSite.site_recid : 0,next.SetSelectedSite,next.SelectedSite,next.layoutupdate);
    }
    private _renderMap = (() => {
        let container = <div id={"newmap"} className={"container-inner"} style={{height:"100%",width: "100%", position: "absolute"}}></div>
        let map = <div id={"newmapcontainer"} style={{ height: "95%", width: "100%"}}></div>;
        let Map = withGoogleMap((props: {markers:MarkerWrappers,SelectedSite: Site,this:any}) => {
            return (
                <GoogleMap defaultZoom={11} center={{ lat: Number(props.SelectedSite.latitude), lng: Number(props.SelectedSite.longitude) }}>
                    <MarkerClusterer 
                        averageCenter
                        enableRetinaIcons
                        gridSize={60}
                        defaultMinimumClusterSize={5}
                        defaultZoomOnClick={true}>
                        {props.markers}
                    </MarkerClusterer>
                </GoogleMap>
            )
        });
        return function(sites: Site[],ID:number,SetSelectedSite:any,SelectedSite:Site,layout:boolean) {
            if(layout){
                Map = withGoogleMap((props: {markers:MarkerWrappers,SelectedSite: Site,this:any}) => {
                    return (
                        <GoogleMap defaultZoom={11} center={{ lat: Number(props.SelectedSite.latitude), lng: Number(props.SelectedSite.longitude) }}>
                            <MarkerClusterer 
                                averageCenter
                                enableRetinaIcons
                                gridSize={60}
                                defaultMinimumClusterSize={5}
                                defaultZoomOnClick={true}>
                                {props.markers}
                            </MarkerClusterer>
                        </GoogleMap>
                    )
                });
            }
            let map_ele: any = <Map SelectedSite={SelectedSite} containerElement={container} mapElement={map} markers={<MarkerWrappers Sites={sites} ClickedId={ID} SetSelectedSite={SetSelectedSite} />}/>
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


