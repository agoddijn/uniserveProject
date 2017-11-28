import * as React from "react";
import { Device, PingRecord } from 'uniserve.m8s.types';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import * as moment from 'moment';

const options = {

}

export class SummaryPie extends React.Component<{device: Device, hackID: number},{data30: any, data60: any, data90: any}> {
    constructor(props: { device: Device, hackID: number }) {
        super(props);
        this.state = { 
            data30: {},
            data60: {},
            data90: {}
        }
    }
    componentWillReceiveProps(next: {device: Device}) {
        this.extractData(next.device);
    }
    extractData(device: Device) {
        let that = this;
        if (device.ping_records.length == 0) return {};
        var data30: any, data60: any, data90: any;
        let req: string = 'ajax/monitoring_api.php?type=devicehistory&device=' + this.props.device.device_recid;
        axios.get(req)
        .then((response) => {
            let backgroundColors = ["rgba(46, 204, 113, 1)", "rgba(231, 76, 60, 1)"];
            data30 = {
                labels: ["up: " + Math.round(response.data.uptime30 * 100) + "%", "down: " + Math.round((1-response.data.uptime30) * 100) + "%"],
                datasets: [{
                    data: [response.data.uptime30, 1-response.data.uptime30],
                    backgroundColor: backgroundColors
                }]
            };
            data60 = {
                labels: ["up: " + (response.data.uptime60 * 100).toFixed(2) + "%", "down: " + ((1-response.data.uptime60) * 100).toFixed(2) + "%"],
                datasets: [{
                    data: [response.data.uptime60, 1-response.data.uptime60],
                    backgroundColor: backgroundColors
                }]
            };
            data90 = {
                labels: ["up: " + Math.round(response.data.uptime90 * 100) + "%", "down: " + Math.round((1-response.data.uptime90) * 100) + "%"],
                datasets: [{
                    data: [response.data.uptime90, 1-response.data.uptime90],
                    backgroundColor: backgroundColors
                }]
            };
            this.setState({
                data30: data30, data60: data60, data90: data90
            });
        })
        .catch((err) => {
            alert("Could not get history \n" + err);
        })
    }
    componentDidMount() {
        //hack to give chart time to mount then set its id;
        //should really fork the reactchart library and add id as a prop
		setTimeout(() => {
            let id = "m8spiechart" + this.props.hackID;
            (this.refs["chart"+this.props.hackID] as any).chart_instance.canvas.id = id;
        }, 2000);
	}
    render() {
        let ref = "chart" + this.props.hackID;
        let data, time;
        if (this.props.hackID % 3 == 0) {
            data = this.state.data30;
            time = "last 30 days";
        } else if (this.props.hackID % 3 == 1) {
            data = this.state.data60;
            time = "between 30 and 60 days ago";
        } else {
            data = this.state.data90;
            time = "between 60 and 90 days ago";
        }
        return (
            <div className="pie-container">
                <p style={{fontSize: "0.7em", margin: "0px", textAlign: "center"}}>{time}</p>
                <Doughnut ref={ref} data={data} />
            </div>  
        )
    }
}