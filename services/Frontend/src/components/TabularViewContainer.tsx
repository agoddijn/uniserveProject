import * as React from "react";
import { Device } from "uniserve.m8s.types";
import { ContainerBar } from "./PresentationalContainerBar"
import { PresentationalTable } from "./PresentationalTable"

export interface DataType{
    response_time:number,
    name: string,
    usage:number,
    time_stamp:string,
}

export class TabularViewContainer extends React.Component<any, {}> {
    constructor(props: any) {
        super(props);
    }
    render() {
        return <div id="listcontainer">
            <ContainerBar Title={"Device List"} />
            <PresentationalTable data={[{response_time:100,name: "Total Tire Kelowna",usage: 30,time_stamp: "Feburary 2 2014",},{response_time:100,name: "Total Tire Kelowna",usage: 30,time_stamp: "Feburary 2 2014",},{response_time:100,name: "Total Tire Kelowna",usage: 30,time_stamp: "Feburary 2 2014",},{response_time:100,name: "Total Tire Kelowna",usage: 30,time_stamp: "Feburary 2 2014",},{response_time:100,name: "Total Tire Kelowna",usage: 30,time_stamp: "Feburary 2 2014",},{response_time:100,name: "Total Tire Kelowna",usage: 30,time_stamp: "Feburary 2 2014",},{response_time:100,name: "Total Tire Kelowna",usage: 30,time_stamp: "Feburary 2 2014",},{response_time:100,name: "Total Tire Kelowna",usage: 30,time_stamp: "Feburary 2 2014",},{response_time:100,name: "Total Tire Kelowna",usage: 30,time_stamp: "Feburary 2 2014",},{response_time:100,name: "Total Tire Kelowna",usage: 30,time_stamp: "Feburary 2 2014",},{response_time:100,name: "Total Tire Kelowna",usage: 30,time_stamp: "Feburary 2 2014",},{response_time:100,name: "Total Tire Kelowna",usage: 30,time_stamp: "Feburary 2 2014",}]} />
        </div>;
    }
}