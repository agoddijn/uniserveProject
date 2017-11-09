import * as React from "react";
import { ContainerBar } from "./PresentationalContainerBar"
import { PresentationalTable } from "./PresentationalTable"
import { Site, Device } from "uniserve.m8s.types";


export class TabularViewContainer extends React.Component<{Sites:Site[], SelectSite: any}, {Sites:Site[], SelectSite: any}> {
    constructor(props: {Sites:Site[], SelectSite: any}) {
        super(props);
        this.state = {Sites: [], SelectSite: {}};
    }
    componentWillReceiveProps(next:{Sites:Site[], SelectSite:any}){
        this.setState({SelectSite: next.SelectSite});
        if(next.Sites.length !== this.props.Sites.length){
            this.setState({Sites: next.Sites});
        }
    } 
    render() {
        return <div id="listcontainer">
            <ContainerBar Title={"Device List"}/>
            <PresentationalTable Sites={this.state.Sites} tabular={true} SelectSite={this.state.SelectSite}/>
        </div>;
    }
}