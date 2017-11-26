import * as React from "react";
import { Site, Device } from "uniserve.m8s.types";
import { Table } from "./Table";

export class TabularViewContainer extends React.Component<{SetLayout: any, Sites:Site[], SelectSite: any, SelectedSite: any}, {Sites:Site[], SelectSite: any, SelectedSite: any}> {
    constructor(props: {SetLayout: any, Sites:Site[], SelectSite: any, SelectedSite: any}) {
        super(props);
        this.state = {
            Sites: [], 
            SelectSite: {},
            SelectedSite: {}
        };
    }
    componentWillReceiveProps(next:{Sites:Site[], SelectSite:any, SelectedSite: any}){
        this.setState({
            SelectSite: next.SelectSite, 
            Sites: next.Sites, 
            SelectedSite: next.SelectedSite
        });
    } 
    render() {
        return <div className="myContainer">
            <div className={"container-bar"}>
                <h5 className="title">
                    Sites
                </h5>
            </div>
            <div className={"container-inner"}>
                <Table 
                    sites={this.state.Sites} 
                    SelectSite={this.props.SelectSite} 
                    SelectedSite={this.state.SelectedSite}
                    SetLayout= {this.props.SetLayout}/>
            </div> 
        </div>;
    }
}