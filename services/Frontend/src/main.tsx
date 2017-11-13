import * as React from "react";
import { TabularViewContainer } from "./components/TabularViewContainer";
import { MapContainer } from "./components/MapContainer";
import { SummaryContainer } from "./components/SummaryContainer";
import { DataLoader } from './DataLoader';
import { Site } from "uniserve.m8s.types";
import { Responsive, WidthProvider } from 'react-grid-layout'
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import { Table } from './components/Table';

export default class main extends React.Component<any, {Sites:Site[], SelectedSite: any, ViewHeight: number}> {
    constructor(props: any) {
        super(props);
        this.state = {
            Sites: [],
            SelectedSite: {},
            ViewHeight: 700
        }
        
    }
    private count:number = 0;
    private timer:any;
    private dt:any = new DataLoader();
    componentDidMount(){
        let that:any = this;
        this.dt.loader()
        .then((data: Site[]) => {
            this.setState({Sites: data, SelectedSite: data[0], ViewHeight: window.innerHeight - 150})
        }).catch((str: string) => {
            alert(str);
        });
    }
    componentDidUpdate(){
        this.timer = window.setTimeout(()=>{
            this.count++;
            console.log(this.count);
            this.dt.loader().then((data: Site[]) => {
                // console.log(data);
                let i = 0;
                for (i = 0; i < data.length; i++) {
                    if (data[i].site_recid == this.state.SelectedSite.site_recid) {
                        break;
                    }
                }
                this.setState({Sites: data, SelectedSite: data[i]});
            }).catch((str: string) => {
                alert(str);
            })
        }, 60000)
    }
    setSelectedSite(siteID: any){
        for (let site of this.state.Sites) {
            if (siteID == site.site_recid) this.setState({SelectedSite: site});
        }
    }
    render() {
        this.timer = window.clearTimeout(this.timer);
        var layout = [
            {i: 'a', x: 0, y: 0, w: 2, h: 4},
            {i: 'b', x: 2, y: 0, w: 2, h: 2},
            {i: 'c', x: 2, y: 2, w: 2, h: 2}
        ];
        var layoutSm = [
            {i: 'a', x: 0, y: 0, w: 2, h: 2},
            {i: 'b', x: 0, y: 2, w: 2, h: 2},
            {i: 'c', x: 2, y: 4, w: 2, h: 2}
        ]
        var layouts = {lg: layout, md: layout, sm: layoutSm, xs: layoutSm, xxs: layoutSm};
        var rowHeight = Math.floor(this.state.ViewHeight / 4);
        return <div className={"grid-container"}>
            <ResponsiveReactGridLayout 
                className="layout"
                layouts={layouts} 
                cols={{lg: 4, md: 4, sm: 2, xs: 2, xxs: 2}}
                rowHeight={rowHeight}
                draggableHandle={".container-bar"}>
                <div key="a">
                    <TabularViewContainer Sites={this.state.Sites} SelectSite={this.setSelectedSite.bind(this)}/>
                </div>
                <div key="b">
                    <MapContainer Device={{}} />
                </div>
                <div key="c">
                    <SummaryContainer Site={this.state.SelectedSite}/>
                </div>
            </ResponsiveReactGridLayout>
        </div>;
    }
}