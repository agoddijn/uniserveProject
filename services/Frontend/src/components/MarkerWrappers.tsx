import * as React from "react";
import { Site, Device } from "uniserve.m8s.types";
import { MarkerWrapper } from "./PresentationalMarkerWrapper"
import { DeviceTable } from "./DeviceTable"
const { compose } = require("recompose");
const {
    Marker,
    InfoWindow
} = require("react-google-maps");

export class MarkerWrappers extends React.Component<{ Sites: Site[],ClickedId:number,SetSelectedSite:any }, { Clicked:number }> {
    constructor(props: { Sites: Site[], ClickedId:number,SetSelectedSite:any }) {
        super(props);
        this.state = {
            Clicked:-1
        }
    }
    componentWillReceiveProps(next:{ Sites: Site[],ClickedId:number,SetSelectedSite:any }){
        console.log(next.ClickedId);
        this.setState({Clicked:next.ClickedId})
    }
    render() {
        let map_ele: any = this.props.Sites.map((s:Site,key:number) => {
            
            let display:boolean = s.site_recid===this.state.Clicked? true:false;
            if(display){
                console.log(this.state.Clicked)
            }
            return <MarkerWrapper key={s.site_recid} Site={s} display={display} SetSelectedSite={this.props.SetSelectedSite}/>
        })
        return <div>{map_ele}</div>;
    }
}
