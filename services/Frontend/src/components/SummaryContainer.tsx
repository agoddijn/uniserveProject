import * as React from "react";
import { Device, Site } from "uniserve.m8s.types";
import * as Chart from 'chart.js';
import { SummaryChart } from "./SummaryChart";
import TextField from 'material-ui/TextField';
import * as moment from 'moment';

const myFormat = 'YYYY-MM-DD[T]HH:mm';

export class SummaryContainer extends React.Component<{Site: Site}, {Site: Site | any, FromDate: string, ToDate: string}> {
    constructor(props: any) {
        super(props);
        this.state = {
            Site: {},
            FromDate: '',
            ToDate: ''
        };
    }
    componentWillReceiveProps(next:{Site:Site}){
        let now = moment();
        let from = moment().subtract(5,'minutes');
        
        if (next.Site.devices && next.Site.devices.length > 0) {
            this.setState({Site: next.Site, FromDate: from.format(myFormat), ToDate: now.format(myFormat)})
        } else {
            this.setState({FromDate: from.format(myFormat), ToDate: now.format(myFormat)});
        }
    }
    fromDateChange(event: any){
        let date = moment(event.target.value, myFormat);
        if(date.isAfter(moment()) || date.isAfter(this.state.ToDate)) {
            alert("Invalid date: From date must be before to date and current date");
        } else {
            this.setState({FromDate: event.target.value});
        }
    }
    toDateChange(event: any){
        let date = moment(event.target.value, myFormat);
        if(date.isAfter(moment()) || date.isBefore(this.state.FromDate)) {
            alert("Invalid date: To date must be after from date and before current date");
        } else {
            this.setState({ToDate: event.target.value});
        }
    }
    render(){
        var title = "Summary";
        var style = {};
        if (this.state.Site && this.state.Site.devices && this.state.Site.devices.length > 0 && this.state.Site.devices[0].ping_records.length > 0) {
            title = this.state.Site.description;
            style = {float: "left", marginLeft: "40px"};
        }
        let toDate = new Date();
        return <div className="myContainer">
            <div className={"container-bar"}>
                <h5 className="title" style={style}>
                    {title}
                </h5>
                <form 
                    className={"date-field"} 
                    noValidate
                >
                    <p>To</p>
                    <input
                        className={"datetime-input"}
                        type="datetime-local"
                        value={this.state.ToDate}
                        style={{color: "white"}}
                        onChange={this.toDateChange.bind(this)}
                    />
                </form>
                <form 
                    className={"date-field"}
                    noValidate
                >
                    <p>From</p>
                    <input
                        className={"datetime-input"}
                        type="datetime-local"
                        value={this.state.FromDate}
                        style={{color: "white"}}
                        onChange={this.fromDateChange.bind(this)}
                    />
                </form>
            </div>
            <div className={"container-inner"}>
                <SummaryChart Site={this.state.Site} FromDate={this.state.FromDate} ToDate={this.state.ToDate}  />
            </div>
        </div>;
    }
}