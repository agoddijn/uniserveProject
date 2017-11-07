import * as React from "react";
import { TabularViewContainer } from "./components/TabularViewContainer";
import { MapContainer } from "./components/MapContainer";
import { SummaryContainer } from "./components/SummaryContainer";
import { DataLoader } from './DataLoader';
import { Site } from "../../../modules/common_types/types/Site"



export default class main extends React.Component<any, {Sites:Site[]}> {
    constructor(props: any) {
        super(props);
        this.state = {
            Sites: []
        }
    }
    componentDidMount(){
        let dt = new DataLoader();
        let that:any = this;
        dt.loader().then((data: Site[]) => {
            console.log(data);
            that.setState(() =>{
                // console.log("reach")
                return {Sites: data}
            })
            // console.log(this.state.Sites);
        }).catch((str: string) => {
            alert(str);
        })
    }
    render() {
        console.log("render")
        return <div>
            <TabularViewContainer Sites={this.state.Sites} />
            <MapContainer Device={{}} />
            <SummaryContainer />
        </div>;
    }
}