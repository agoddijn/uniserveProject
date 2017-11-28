
import * as React from "react";
import { TabularViewContainer } from "./components/TabularViewContainer";
// import {NewMapContainer} from "./components/NewMapContainer";
import { MapContainer } from "./components/MapContainer";
import { SummaryContainer } from "./components/SummaryContainer";
import { ReportContainer } from "./components/ReportContainer";
import { InfoBar } from "./components/PresentationalInfoBar"
import { DataLoader } from './DataLoader';
import { Site } from "uniserve.m8s.types";
import { Responsive, WidthProvider } from 'react-grid-layout';
import * as moment from 'moment';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const globalAny: any = global;

function layoutsAreEqual(l1: any, l2: any) {
    if (l1.length != l2.length) return false;
    for (let i = 0; i < l1.length; i++) {
        return l1[i].i == l2[i].i &&
            l1[i].w == l2[i].w &&
            l1[i].h == l2[i].h &&
            l1[i].x == l2[i].x &&
            l1[i].y == l2[i].y;
    }
}

export default class main extends React.Component<any, { Sites: Site[], SelectedSite: Site, Layout: any, LayoutName: string, ViewHeight: number,layoutupdate:boolean,CurrentTime:string}> {
    constructor(props: any) {
        super(props);

        let height = window.innerHeight;

        //uniserve header
        this.state = {
            Sites: [],
            SelectedSite: null,
            Layout: { lg: this.layouts.default },
            LayoutName: "default",
            ViewHeight: window.innerHeight - 70,
            layoutupdate:false,
            CurrentTime: ""
        }
    }

    private layouts = {
        default: [
            { i: 'sites', x: 0, y: 0, w: 2, h: 4 },
            { i: 'map', x: 2, y: 0, w: 2, h: 2 },
            { i: 'summary', x: 2, y: 2, w: 2, h: 2 }
        ],
        fullmap: [
            { w: 4, h: 4, x: 0, y: 0, i: 'map' }
        ],
        report: [
            { i: 'sites', x: 0, y: 0, w: 2, h: 4 },
            { i: 'report', x: 2, y: 0, w: 2, h: 4 }
        ],
        saved: []
    }
    
    private timer: any;
    private dt: any = new DataLoader();
    private myFormat = 'YYYY-MM-DD[T]HH:mm';
    componentDidMount() {
        let that: any = this;
        this.dt.loader().then((data: Site[]) => {
            let curr:string = moment().format(this.myFormat).replace("T"," ");
            console.log(curr);
            this.setState({ Sites: data, SelectedSite: data[0],layoutupdate:false,CurrentTime:curr });
        }).catch((str: string) => {
            alert(str);
        })
    }
    componentDidUpdate() {
        this.timer = window.setTimeout(() => {
            let curr:string = moment().format();
            this.dt.loader().then((data: Site[]) => {
                this.setState({ Sites: data, SelectedSite: this.state.SelectedSite,layoutupdate:false,CurrentTime:curr });
            }).catch((str: string) => {
                alert(str);
            })
        }, 10000)
    }
    setSelectedSite(siteID: number) {
        for (let site of this.state.Sites) {
            if (siteID == site.site_recid) {
                this.setState({ SelectedSite: site });

            }
            
        }
    }
    setLayout(layoutname: string) {
        let layout = this.layouts[layoutname];
        this.setState({ 
            Layout: { lg: layout },
            layoutupdate:true,
            LayoutName: layoutname
        });
        
    }
    handleLayoutChange(layout: any) {
        if (!layoutsAreEqual(layout, this.layouts.fullmap) !) {
            this.layouts.saved = layout;
            this.setState({ Layout: { lg: layout } });
        }
    }

    renderGridComponents(){
        let toReturn        =  [];
        let displaySummary  = (this.state.LayoutName == "default");
        let displayReport   = (this.state.LayoutName == "report");
        let displayMap      = (this.state.LayoutName == "default") 
                                || (this.state.LayoutName == "fullmap");
        let displaySites    = (this.state.LayoutName == "default") 
                                || (this.state.LayoutName == "report");
        if(displaySites){
            toReturn.push(
            <div key="sites"><TabularViewContainer
                    SetLayout={this.setLayout.bind(this)}  
                    Sites={this.state.Sites} 
                    SelectSite={this.setSelectedSite.bind(this)} 
                    SelectedSite={this.state.SelectedSite} /></div>);
        }
        if(displayMap){
            toReturn.push(
                <div key="map"><MapContainer 
                    SetLayout={this.setLayout.bind(this)} 
                    Sites={this.state.Sites} 
                    SetSelectedSite={this.setSelectedSite.bind(this)} 
                    SelectedSite={this.state.SelectedSite} 
                    layoutupdate={this.state.layoutupdate}/>
                </div>);
        }
        if(displaySummary){
            toReturn.push(
                <div key="summary">
                    <SummaryContainer Site={this.state.SelectedSite} />
                </div>);
        }
        if(displayReport){
            toReturn.push(
                <div key="report"> 
                    <ReportContainer SelectedSite={this.state.SelectedSite} SetLayout={this.setLayout.bind(this)} />
                </div>);
        }

        return toReturn;

    }

    render() {
        this.timer = window.clearTimeout(this.timer);
        var rowHeight = Math.floor(this.state.ViewHeight / 4);
        
        return <div className={"grid-container"}>
            <InfoBar location={"Vancouver"} CurrentTime={this.state.CurrentTime} />
            <ResponsiveReactGridLayout
                className="layout"
                layouts={this.state.Layout}
                cols={{ lg: 4, md: 4, sm: 4, xs: 2, xxs: 2 }}
                rowHeight={rowHeight}
                draggableHandle=".container-bar"
                draggableCancel=".no-drag"
                onLayoutChange={this.handleLayoutChange.bind(this)}
                margin={[5,5]}
            >
            {this.renderGridComponents()}
            </ResponsiveReactGridLayout>
        </div>;
    }
}
