import * as React from "react";
import { Device, Site } from "uniserve.m8s.types";
import { ContainerBar } from "./PresentationalContainerBar";
import * as Chart from 'chart.js';
import { SummaryChart } from "./SummaryChart";

function formatDate(date: Date) {
    var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

export class SummaryContainer extends React.Component<{Sites: Site[]}, {Site: any}> {
    constructor(props: any) {
        super(props);
        this.state = {Site: {}};
    }
    componentWillReceiveProps(next:{Sites:Site[]}){
        this.loadDevice(next.Sites);
    }
    loadDevice(sites: Site[]) {
        if (sites.length > 0) {
            if (sites[0].devices && sites[0].devices.length > 0) {
                this.setState((prevState,props) => {
                    return {Site: sites[0]}
                })
            }
        }
    }
    render() {
        var title = "Summary";
        if (this.state.Site && this.state.Site.devices && this.state.Site.devices.length > 0 && this.state.Site.devices[0].ping_records.length > 0) {
            title = this.state.Site.description + ": "
            var date: Date = new Date(this.state.Site.devices[0].ping_records[0].datetime);
            title += formatDate(date);
        }
        return <div id="summarycontainer">
            <ContainerBar Title={title} />
            <SummaryChart Site={this.state.Site} />
        </div>;
    }
}