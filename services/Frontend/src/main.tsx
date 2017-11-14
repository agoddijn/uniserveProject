import * as React from "react";
import { TabularViewContainer } from "./components/TabularViewContainer";
// import {NewMapContainer} from "./components/NewMapContainer";
import { MapContainer } from "./components/MapContainer";
import { SummaryContainer } from "./components/SummaryContainer";
import { DataLoader } from './DataLoader';
import { Site } from "uniserve.m8s.types";
import { Responsive, WidthProvider } from 'react-grid-layout'
const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class main extends React.Component<any, {Sites:Site[], SelectedSite: any, Layout: any, ViewHeight: number}> {
    constructor(props: any) {
        super(props);

        let height = window.innerHeight;
        
        //uniserve header
        height = height - 100;

        this.state = {
            Sites: [],
            SelectedSite: {},
            Layout: {lg:this.layouts.default},
            ViewHeight: height
        }
    }
    private layouts = {
        default: [
            {i: 'sites', x: 0, y: 0, w: 2, h: 4}, 
            {i: 'map', x: 2, y: 0, w: 2, h: 2}, 
            {i: 'summary', x: 2, y: 2, w: 2, h: 2}
        ],
        fullmap: [
            {i: 'map', x: 0, y: 0, w: 4, h: 4}, 
            {i: 'sites', x: 0, y: 4, w: 2, h: 2}, 
            {i: 'summary', x: 2, y: 4, w: 2, h: 2}
        ]
    }
    private timer:any;
    private dt:any = new DataLoader();
    componentDidMount(){
        let that:any = this;
        this.dt.loader().then((data: Site[]) => {
            // console.log(data);
            this.setState({Sites: data, SelectedSite: data[0]});
        }).catch((str: string) => {
            alert(str);
        }) 
    }
    componentDidUpdate(){
        this.timer = window.setTimeout(()=>{
            this.dt.loader().then((data: Site[]) => {
                console.log(data[0].latitude);
                this.setState({Sites: data, SelectedSite: this.state.SelectedSite });
            }).catch((str: string) => {
                alert(str);
            })
        }, 500000)
    }
    setSelectedSite(siteID: number){
        for (let site of this.state.Sites) {
            if (siteID == site.site_recid) this.setState({SelectedSite: site});
        }
    }
    setLayout(layout: string | Array<any>){
        if(typeof layout === 'string') layout = this.layouts[layout];
        this.setState({Layout:{lg: layout}});
    }
    render() {
        this.timer = window.clearTimeout(this.timer);
        var rowHeight = Math.floor(this.state.ViewHeight / 4);
        return <div className={"grid-container"}>
            <ResponsiveReactGridLayout 
                className="layout"
                layouts={this.state.Layout} 
                cols={{lg: 4, md: 4, sm: 4, xs: 2, xxs: 2}}
                rowHeight={rowHeight}
                draggableHandle=".container-bar"
                >
                <div key="sites">
                    <TabularViewContainer Sites={this.state.Sites} SelectSite={this.setSelectedSite.bind(this)}/>
                </div>
                <div key="map">
                    <MapContainer SetLayout={this.setLayout.bind(this)} Sites={this.state.Sites} />
                </div>
                <div key="summary">
                    <SummaryContainer Site={this.state.SelectedSite}/>
                </div>
            </ResponsiveReactGridLayout>
        </div>;
    }
}