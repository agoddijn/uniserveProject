import * as React from "react";
import { Site,Device} from "uniserve.m8s.types";




export class InfoBar extends React.Component<{location: string, CurrentTime:string}, {p:any}> {
    constructor(props: {location: string,CurrentTime:string}) {
        super(props);
        this.state={
            p:<p id={"clock"}>{"--Last Updated: " + this.props.CurrentTime+ "--" }</p>
        }
    }

    componentWillReceiveProps(next:{location: string, CurrentTime:string}){
        let p:any =
            <p id={"clock"}>{"Last Updated: " + next.CurrentTime}</p>
        this.setState({p:p});
    }
    render() {
       
        return<div id={"info-bar"} style={{ color:"white", fontSize:"1.5vh", width:"100%", height:"2.5vh", opacity:0.8, position:"relative"}}>{"Response times from: " + this.props.location}{this.state.p}</div> 

    }
}