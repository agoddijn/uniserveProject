import * as React from "react";
import { Device } from "uniserve.m8s.types";
import { ContainerBar } from "./PresentationalContainerBar"

export class SummaryContainer extends React.Component<any, {}> {
    constructor(props: any) {
        super(props);
    }
    render() {
        return <div id="summarycontainer">
            <ContainerBar Title={"Summary"} />
        </div>;
    }
}