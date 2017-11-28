import * as React from "react";
import { Site,Device} from "uniserve.m8s.types";




export class InfoBar extends React.Component<{location: string, CurrentTime:string}, any> {
    constructor(props: {location: string,CurrentTime:string}) {
        super(props);
    }

 
    render() {
        return <div id={"info-bar"} style={{ color:"white", fontSize:"1.5vh", width:"100%", height:"2.5vh", opacity:100, position:"relative", backgroundColor:"#D4321C"}}>{"Data Fetched from " + this.props.location}<p>{"Latest TimeStamp: " + this.props.CurrentTime }</p></div>        
    }
}