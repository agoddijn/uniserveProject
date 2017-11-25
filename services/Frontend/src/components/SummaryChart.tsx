import * as React from "react";
var PropTypes = require('prop-types')
import { withStyles } from 'material-ui/styles';
import { Site, Device, PingRecord } from 'uniserve.m8s.types';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import * as moment from 'moment';

const myFormat = 'YYYY-MM-DD[T]HH:mm';

const options = {
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
            scaleLabel: {
                display: true,
                labelString: "response (ms)"
            },
            gridLines: {
                display: true,
                color: "rgba(255,99,132,0.2)"
            }
        }],
        xAxes: [{
            scaleLabel: {
                display: true,
                labelString: "time"
            },
            gridLines: {
                display: false
            }
        }]
    },
    animation: {
        duration: 0
    }
}

const colors = [
    "rgba(220, 57, 18, 0.5)",
    "rgba(220, 57, 18, 1)",
    "rgba(51, 102, 204, 0.5)",
    "rgba(51, 102, 204, 1)",
    "rgba(255, 153, 0, 0.5)",
    "rgba(255, 153, 0, 1)",
    "rgba(16, 150, 24, 0.5)",
    "rgba(16, 150, 24, 1)",
    "rgba(153, 0, 153, 0.5)",
    "rgba(153, 0, 153, 1)",
    "rgba(59, 62, 172, 0.5)",
    "rgba(59, 62, 172, 1)"
]

export class SummaryChart extends React.Component<{ Site: Site, FromDate: string, ToDate: string }, {Data: any}> {
    constructor(props: { Site: Site, FromDate: string, ToDate: string }) {
        super(props);
        this.state = {Data: {}};
    }
    componentWillReceiveProps(next: {Site: Site, FromDate: string, ToDate: string}){
        this.extractData(next.Site, next.FromDate, next.ToDate);
    }
    extractData(site: Site, fromDate: string, toDate: string) {
        let that = this;
        if (!site.devices || site.devices.length == 0 || site.devices[0].ping_records.length == 0) return {};
        var data: any = {
            labels: [],
            datasets: []
        }
        let dataPromises = [];
        let startdate = moment(fromDate, myFormat).utc().format();
        let enddate = moment(toDate, myFormat).utc().format();
        for (let j = 0; j < site.devices.length; j++) {
            var device = site.devices[j];
            let req: string = '/ajax/monitoring_api.php?type=device&device='+ device.device_recid + '&startdate='+ startdate + '&enddate=' + enddate;
            dataPromises.push(axios.get(req));
        }
        Promise.all(dataPromises)
        .then((responses: any) => {
            let devices: Device[] = [];
            for (let res of responses) {
                devices.push(res.data);
            }
            for (let j = 0; j < devices.length; j++) {
                device = devices[j];
                data.datasets.push({
                    data: [],
                    label: device.description,
                    backgroundColor: "rgba(0,0,0,0)",
                    borderColor: colors[(2*j)%colors.length],
                    hoverBorderColor: colors[(2*j+1)%colors.length],
                    borderWidth: 2,
                    pointRadius: [],
                    pointStyle: [],
                    pointBorderColor: [],
                    pointHoverRadius: 6
                })
                for (let i = 0; i < device.ping_records.length; i ++) {
                    let curRecord: PingRecord = device.ping_records[i];
                    var date = moment.utc(curRecord.datetime);
                    var dateString: string = date.local().format('D[/]M[-]HH[:]mm');
                    if (j == 0) data.labels.push(dateString);
                    if (curRecord.responded) {
                        data.datasets[j].data.push(curRecord.ms_response);
                        data.datasets[j].pointRadius.push(4);
                        data.datasets[j].pointStyle.push('circle');
                        data.datasets[j].pointBorderColor.push(colors[(2*j+1)%colors.length]);
                    } else {
                        data.datasets[j].data.push(0);
                        data.datasets[j].pointRadius.push(6);
                        data.datasets[j].pointStyle.push('crossRot');
                        data.datasets[j].pointBorderColor.push("rgba(255,0,0,1)");
                    } 
                }
            }
            that.setState({Data: data});  
        })
        .catch((err: any) => {
            alert("Error in parsing data for summary chart\n" + err);
        })
    }

    componentDidMount() {
        //hack to give chart time to mount then set its id;
        //should really fork the reactchart library and add id as a prop
		setTimeout(() => {
            (this.refs.chart as any).chart_instance.canvas.id = "m8slinechart";
        }, 2000);
	}

    render() {
        
        return (
            <div id="chartcontainer">
                <Line data={this.state.
                    Data} ref="chart" options={options} redraw />
            </div>
        );
    }
}