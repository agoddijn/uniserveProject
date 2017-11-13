import * as React from "react";
import { TabularViewContainer } from "./components/TabularViewContainer";
import { MapContainer } from "./components/MapContainer";
import { SummaryContainer } from "./components/SummaryContainer";
import { DataLoader } from './DataLoader';
import { Site } from "uniserve.m8s.types";
import { Responsive, WidthProvider } from 'react-grid-layout'
const ResponsiveReactGridLayout = WidthProvider(Responsive);

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
        this.dt.loader().then((data: Site[]) => {
            // console.log(data);
            this.setState({Sites: data, SelectedSite: data[0]});
        }).catch((str: string) => {
            alert(str);
        })
    }
    componentDidUpdate(){
        this.timer = window.setTimeout(()=>{
            this.count++;
            console.log(this.count);
            this.dt.loader().then((data: Site[]) => {
                // console.log(data);
                this.setState({Sites: data, SelectedSite: data[0]});
            }).catch((str: string) => {
                alert(str);
            })
        }, 5000)
    }
    setSelectedSite(site: Site){
        this.setState({SelectedSite: site});
    }
    render() {
        this.timer = window.clearTimeout(this.timer);
        var layout = [
            {i: 'a', x: 0, y: 0, w: 6, h: 12},
            {i: 'b', x: 6, y: 0, w: 6, h: 6},
            {i: 'c', x: 6, y: 7, w: 6, h: 6}
        ];
        var layouts = {lg: layout};
        var rowHeight = Math.floor(this.state.ViewHeight / 12);
        return <div className={"grid-container"}>
            <ResponsiveReactGridLayout 
                className="layout"
                layouts={layouts} 
                cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                rowHeight={rowHeight}>
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