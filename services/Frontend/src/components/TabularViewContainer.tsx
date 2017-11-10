import * as React from "react";
import { ContainerBar } from "./PresentationalContainerBar"
import { PresentationalTable } from "./PresentationalTable"
import { Site, Device } from "uniserve.m8s.types";

export class TabularViewContainer extends React.Component<{Sites:Site[], SelectSite: any, SelectedSite: any}, {Sites:Site[], SelectSite: any, SelectedSite: any}> {
    constructor(props: {Sites:Site[], SelectSite: any, SelectedSite: any}) {
        super(props);
        this.state = {
            Sites: [], 
            SelectSite: {}, 
            SelectedSite: {}
        };
    }
    componentWillReceiveProps(next:{Sites:Site[], SelectSite:any, SelectedSite: any}){
        this.setState({SelectSite: next.SelectSite});
        if(next.Sites.length !== this.props.Sites.length){
            this.setState({Sites: next.Sites});
        }
        if(next.SelectedSite){
            this.setState({SelectedSite: next.SelectedSite});
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
                <PresentationalTable Sites={this.state.Sites} tabular={true} SelectSite={this.state.SelectSite} SelectedSite={this.state.SelectedSite}/>
            </div> 
        </div>;
    }
}