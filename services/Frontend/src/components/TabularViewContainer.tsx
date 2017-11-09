import * as React from "react";
import { ContainerBar } from "./PresentationalContainerBar"
import { PresentationalTable } from "./PresentationalTable"
import { Site, Device } from "uniserve.m8s.types";


export class TabularViewContainer extends React.Component<{Sites:Site[]}, {Devices:Device[]}> {
    constructor(props: {Sites:Site[]}) {
        super(props);
        this.state = {Devices: []};
    }
    componentWillReceiveProps(next:{Sites:Site[]}){
        if(next.Sites.length !== this.props.Sites.length){
            this.loadDevices(next.Sites);
        }
    }
    loadDevices(sites:Site[]):void{
        let device_array:Device[] = [];
        for(let s of sites){
            for(let d of s.devices){
                device_array.push(d);
            }
        }
        console.log(device_array);
        this.setState((prevState,props) => {
            return {Devices: device_array}
        })
    }  
    render() {
        return <div id="listcontainer">
            <ContainerBar Title={"Device List"} />
            <PresentationalTable Devices={this.state.Devices} tabular={true}/>
        </div>;
    }
}