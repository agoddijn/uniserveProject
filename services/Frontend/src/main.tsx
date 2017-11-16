import * as React from "react";
import { TabularViewContainer } from "./components/TabularViewContainer";
// import {NewMapContainer} from "./components/NewMapContainer";
import { MapContainer } from "./components/MapContainer";
import { SummaryContainer } from "./components/SummaryContainer";
import { DataLoader } from './DataLoader';
import { Site } from "uniserve.m8s.types";
import { Responsive, WidthProvider } from 'react-grid-layout'
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

export default class main extends React.Component<any, { Sites: Site[], SelectedSite: any, Layout: any, ViewHeight: number }> {
    constructor(props: any) {
        super(props);

        let height = window.innerHeight;

        //uniserve header
        height = height - 100;

        this.state = {
            Sites: [],
            SelectedSite: {},
            Layout: { lg: this.layouts.default },
            ViewHeight: height
        }
    }

    private layouts = {
        default: [
            { i: 'sites', x: 0, y: 0, w: 2, h: 4 },
            { i: 'map', x: 2, y: 0, w: 2, h: 2 },
            { i: 'summary', x: 2, y: 2, w: 2, h: 2 }
        ],
        fullmap: [
            { w: 2, h: 2, x: 0, y: 4, i: 'sites' },
            { w: 4, h: 4, x: 0, y: 0, i: 'map' },
            { w: 2, h: 2, x: 2, y: 4, i: 'summary' }
        ]
    }
    
    private timer: any;
    private dt: any = new DataLoader();
    componentDidMount() {
        let that: any = this;
        this.dt.loader().then((data: Site[]) => {
            // console.log(data);
            this.setState({ Sites: data, SelectedSite: data[0] });
        }).catch((str: string) => {
            alert(str);
        })
    }
    componentDidUpdate() {
        this.timer = window.setTimeout(() => {
            this.dt.loader().then((data: Site[]) => {
                console.log(data[0].latitude);
                this.setState({ Sites: data, SelectedSite: this.state.SelectedSite });
            }).catch((str: string) => {
                alert(str);
            })
        }, 60000)
    }
    setSelectedSite(siteID: number) {
        for (let site of this.state.Sites) {
            if (siteID == site.site_recid) this.setState({ SelectedSite: site });
        }
    }
    setLayout(layout: string | Array<any>) {
        if (typeof layout === 'string') layout = this.layouts[layout];
        this.setState({ Layout: { lg: layout } });
    }
    handleLayoutChange(layout: any) {
        if (!layoutsAreEqual(layout, this.layouts.fullmap)) {
            this.layouts.default = layout;
            this.setState({ Layout: { lg: layout } });
        }
    }
    render() {
        this.timer = window.clearTimeout(this.timer);
        var rowHeight = Math.floor(this.state.ViewHeight / 4);
        return <div className={"grid-container"}>
            <ResponsiveReactGridLayout
                className="layout"
                layouts={this.state.Layout}
                cols={{ lg: 4, md: 4, sm: 4, xs: 2, xxs: 2 }}
                rowHeight={rowHeight}
                draggableHandle=".container-bar"
                onLayoutChange={this.handleLayoutChange.bind(this)}
            >
                <div key="sites">
                    <TabularViewContainer Sites={this.state.Sites} SelectSite={this.setSelectedSite.bind(this)} />
                </div>
                <div key="map">
                    <MapContainer SetLayout={this.setLayout.bind(this)} Sites={this.state.Sites} />
                </div>
                <div key="summary">
                    <SummaryContainer Site={this.state.SelectedSite} />
                </div>
            </ResponsiveReactGridLayout>
        </div>;
    }
}