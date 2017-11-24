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
        let from = moment().subtract(1,'days');
        let changedTo = true, changedFrom = true;
        if (moment(this.state.ToDate, myFormat).isBefore(moment().subtract(3, 'minutes'))) {
            changedTo = false;
            now = moment(this.state.ToDate,myFormat);
        }
        if (moment(this.state.FromDate, myFormat).isBefore(moment().subtract(1, 'days').subtract(3, 'minutes')) || moment(this.state.FromDate, myFormat).isAfter(moment().subtract(1, 'days').add(1, 'minutes'))) {
            changedFrom = false;
            from = moment(this.state.FromDate,myFormat);
        }

        if (next.Site && next.Site.devices && next.Site.devices.length > 0) {
            if (changedFrom || changedTo) {
                this.setState({Site: next.Site, FromDate: from.format(myFormat), ToDate: now.format(myFormat)})
            } else {
                this.setState({Site: next.Site});
            } 
        } else {
            if (changedFrom || changedTo){
                this.setState({FromDate: from.format(myFormat), ToDate: now.format(myFormat)});
            } 
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
        var style = {};
        var title = (
            <h5 className="title" style={style}>
                Summary
            </h5>
        )
        if (this.state.Site && this.state.Site.devices && this.state.Site.devices.length > 0 && this.state.Site.devices[0].ping_records.length > 0) {
            style = {float: "left", paddingTop: "0px", paddingRight: "20px"};
            title = (
                <div className={"summary-title"}>
                    <h5 className="title" style={style}>
                        {this.state.Site.description}
                    </h5>
                </div>
            )
        }
        let toDate = new Date();
        return <div className="myContainer">
            <div className={"container-bar"}>
                {title}
                <form 
                    className={"date-field no-drag"} 
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
                    className={"date-field no-drag"}
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