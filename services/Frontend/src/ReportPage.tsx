import * as React from "react";

export default class ReportPage extends React.Component<{SiteID: number },any> {
    constructor(props: {SiteID: number}) {
        super(props);
    }
    render(){
        console.log("Rendering Report Page");
        return(
            <p>{this.props.SiteID}</p>
        )
    }
}