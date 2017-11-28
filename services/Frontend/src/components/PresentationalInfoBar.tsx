import * as React from "react";
import { Site,Device} from "uniserve.m8s.types";




export class InfoBar extends React.Component<{location: string, CurrentTime:string}, any> {
    constructor(props: {location: string,CurrentTime:string}) {
        super(props);
    }

 
    render() {
        console.log(this.props.CurrentTime)
        return <div id={"info-bar"} style={{ color:"white", fontSize:"1.5vh", width:"100%", height:"2.5vh", opacity:0.8, position:"relative"}}>{"Response times from server located in: " + this.props.location}<p>{"Last Updated: " + this.props.CurrentTime }</p></div>        
    }
}