import * as React from "react";
import { Site, Device } from "uniserve.m8s.types";
var _ = require('lodash');
const { compose } = require("recompose");
const {
    Marker,
    InfoWindow
} = require("react-google-maps");
interface ColorScheme {
    [index: string]: number
}
export class ColorMarker extends React.Component<{ Devices: Device[] }, { ColorScheme: string[] }> {
    constructor(props: { Devices: Device[] }) {
        super(props);
        this.state = {
            ColorScheme: ["green", "green", "green", "green", "green", "green"]
        }
    }
    setColorScheme(Devices: any[]) {
        let color_scheme: ColorScheme = {};
        color_scheme["green"] = 0;
        color_scheme["red"] = 0;
        color_scheme["orange"] = 0;
        for (let device of Devices) {
            let pings = 0, unresponsive = 0, avResponse = 0;
            for (let record of device.ping_records) {
                pings += 1;
                if (!record.responded) unresponsive += 1;
                avResponse += record.ms_response;
            }
            avResponse = Math.round(avResponse / (pings - unresponsive));
            if (unresponsive > 0) {
                if (unresponsive == pings) {
                    color_scheme.red++;
                } else {
                    color_scheme.orange++;
                }
            } else {
                color_scheme.green++;
            }
        }
        let nonzero_new_color_scheme: ColorScheme = _.pickBy(color_scheme, (num: number, key: string) => {
            return !_.isEqual(num, 0);
        });
        let nonzero_keys: number = Object.keys(nonzero_new_color_scheme).length;
        let sort_color_scheme: ColorScheme = _.invert(_.invert(color_scheme));
        let sort_keys: number = Object.keys(sort_color_scheme).length;
        if (nonzero_keys === 1) {
            console.log("reach")
            this.setState({
                ColorScheme: [Object.keys(nonzero_new_color_scheme)[0], Object.keys(nonzero_new_color_scheme)[0], Object.keys(nonzero_new_color_scheme)[0], Object.keys(nonzero_new_color_scheme)[0], Object.keys(nonzero_new_color_scheme)[0], Object.keys(nonzero_new_color_scheme)[0]]
            })
        } else if (nonzero_keys === 2) {
            if (sort_keys === 1) {
                this.setState({
                    ColorScheme: [Object.keys(nonzero_new_color_scheme)[0], Object.keys(nonzero_new_color_scheme)[0], Object.keys(nonzero_new_color_scheme)[0], Object.keys(nonzero_new_color_scheme)[1], Object.keys(nonzero_new_color_scheme)[1], Object.keys(nonzero_new_color_scheme)[1]]
                })
            } else {
                let rank_new_colorscheme = _.fromPairs(_.sortBy(_.toPairs(sort_color_scheme), function(a){return a[1]}).reverse());
                this.setState({
                    ColorScheme: [Object.keys(rank_new_colorscheme)[0], Object.keys(rank_new_colorscheme)[0], Object.keys(rank_new_colorscheme)[0], Object.keys(rank_new_colorscheme)[0], Object.keys(rank_new_colorscheme)[1], Object.keys(rank_new_colorscheme)[1]]
                })
            }
        } else if(nonzero_keys === 3){
            if(sort_keys === 1){
                this.setState({
                    ColorScheme: [Object.keys(nonzero_new_color_scheme)[0], Object.keys(nonzero_new_color_scheme)[0], Object.keys(nonzero_new_color_scheme)[0], Object.keys(nonzero_new_color_scheme)[0], Object.keys(nonzero_new_color_scheme)[1], Object.keys(nonzero_new_color_scheme)[1]]
                })
            }else if (sort_keys === 2){
                let rank_new_colorscheme = _.fromPairs(_.sortBy(_.toPairs(sort_color_scheme), function(a){return a[1]}).reverse());
                this.setState({
                    ColorScheme: [Object.keys(rank_new_colorscheme)[0], Object.keys(rank_new_colorscheme)[0], Object.keys(rank_new_colorscheme)[0], Object.keys(rank_new_colorscheme)[0], Object.keys(rank_new_colorscheme)[1], Object.keys(rank_new_colorscheme)[2]]
                })
            }else{
                let rank_new_colorscheme = _.fromPairs(_.sortBy(_.toPairs(sort_color_scheme), function(a){return a[1]}).reverse());
                this.setState({
                    ColorScheme: [Object.keys(rank_new_colorscheme)[0], Object.keys(rank_new_colorscheme)[0], Object.keys(rank_new_colorscheme)[0], Object.keys(rank_new_colorscheme)[1], Object.keys(rank_new_colorscheme)[1], Object.keys(rank_new_colorscheme)[2]]
                })
            }
        }
        
    }
    componentsWillReceiveProps(Devices: any[]) {
        console.log("reach")
        this.setColorScheme(Devices);
    }

    render() {
        return (<div className="polygon-wrap">
            {this.state.ColorScheme.map((c:string, key:number) => {
                return <div key={key} className="polygon" style={{ backgroundColor: c }}></div>
            })}
        </div>)
    }
}
