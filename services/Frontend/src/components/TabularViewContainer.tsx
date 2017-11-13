import * as React from "react";
import { ContainerBar } from "./PresentationalContainerBar"
import { PresentationalTable } from "./PresentationalTable"
import { SiteTable } from "./PresentationalSiteTable"
import { Site, Device } from "uniserve.m8s.types";
import { Table } from "./Table";

export class TabularViewContainer extends React.Component<{Sites:Site[], SelectSite: any}, {Sites:Site[], SelectSite: any}> {
    constructor(props: {Sites:Site[], SelectSite: any, SelectedSite: any}) {
        super(props);
        this.state = {
            Sites: [], 
            SelectSite: {}
        };
    }
    componentWillReceiveProps(next:{Sites:Site[], SelectSite:any, SelectedSite: any}){
        this.setState({SelectSite: next.SelectSite});
        if(next.Sites.length !== this.props.Sites.length){
            this.setState({Sites: next.Sites});
        }
    } 
    render() {
        return <div className="myContainer">
            {/* <ContainerBar Title={"Device List"}/> */}
            <div className={"container-bar"}>
                <h5 className="title">
                    Sites
                </h5>
            </div>
            <div className={"container-inner"}>
                <Table sites={this.state.Sites} SelectSite={this.state.SelectSite}/>
            </div> 
        </div>;
    }
}