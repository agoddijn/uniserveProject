import * as React from "react";
var PropTypes = require('prop-types')
import { withStyles } from 'material-ui/styles';
import { Device, PingRecord } from 'uniserve.m8s.types';
import { Line } from 'react-chartjs-2';

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };

export class SummaryChart extends React.Component<{ Device: Device }, {Data: any}> {
    constructor(props: { Device: Device }) {
        super(props);
        this.state = {Data: data};
    }
    extractData() {
        return data;
    }
    render() {
        return (
            <div>
                <Line data={this.state.
                    Data} />
            </div>
        );
    }
}