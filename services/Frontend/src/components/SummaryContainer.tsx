import * as React from "react";
import { Device, Site } from "uniserve.m8s.types";
import { ContainerBar } from "./PresentationalContainerBar";
import * as Chart from 'chart.js';
import { SummaryChart } from "./SummaryChart";


export class SummaryContainer extends React.Component<{Sites: Site[]}, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            Device: {}
        }
    }
    componentWillReceiveProps(next:{Sites:Site[]}){
        this.loadDevice(next.Sites);
    }
    loadDevice(sites: Site[]) {
        if (sites.length > 0) {
            if (sites[0].devices && sites[0].devices.length > 0) {
                this.setState((prevState,props) => {
                    return {Device: sites[0].devices[0]}
                })
            }
        }
    }
    render() {
        var title = "Summary";
        if (this.state.Device.description) {
            title += ": " + this.state.Device.description;
        }
        return <div id="summarycontainer">
            <ContainerBar Title={title} />
            <SummaryChart Device={this.state.Device} />
        </div>;
    }
}