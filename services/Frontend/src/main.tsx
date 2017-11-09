import * as React from "react";
import { TabularViewContainer } from "./components/TabularViewContainer";
import { MapContainer } from "./components/MapContainer";
import { SummaryContainer } from "./components/SummaryContainer";
import { DataLoader } from './DataLoader';
import { Site } from "uniserve.m8s.types"

export default class main extends React.Component<any, {Sites:Site[], SelectedSite: any}> {
    constructor(props: any) {
        super(props);
        this.state = {
            Sites: [],
            SelectedSite: {}
        }
    }
    componentDidMount(){
        let dt = new DataLoader();
        let that:any = this;
        dt.loader().then((data: Site[]) => {
            console.log(data);
            that.setState(() =>{
                // console.log("reach")
                return {Sites: data, SelectedSite: data[0]}
            })
            // console.log(this.state.Sites);
        }).catch((str: string) => {
            alert(str);
        })
    }
    setSelectedSite(site: Site){
        this.setState({SelectedSite: site});
    }
    render() {
        console.log("render")
        return <div>
            <TabularViewContainer Sites={this.state.Sites} SelectSite={this.setSelectedSite.bind(this)} />
            <MapContainer Device={{}} />
            <SummaryContainer Site={this.state.SelectedSite}/>
        </div>;
    }
}