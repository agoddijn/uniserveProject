import * as React from "react";
import { Site,Device } from "uniserve.m8s.types"
import { ContainerBar } from "./PresentationalContainerBar"
var PropTypes = require('prop-types')
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { DeviceBody } from './PresentationalDeviceBody'

export class SiteTable extends React.Component<{ Sites: Site[], SelectSite: any}, { Sites:Site[], UpdateSite: any, SelectedSite: any }> {
  constructor(props: { Sites: Site[], SelectSite: any}) {
    super(props);
    this.state = {
      Sites:[],
      UpdateSite: this.updateSite,
      SelectedSite: {}
    }
  }
  componentWillReceiveProps(next: { Sites: Site[]}) {
    this.setState({ Sites:next.Sites });
    console.log(next);
  }
  updateSite(n: Site, e: any) {
    this.props.SelectSite(n);
    this.setState({ SelectedSite: n });
  }
  checkRespondedColor(devices:Device[]):string{
    let statusColor:string = "green";
    let unresponsive:number,pings:number = 0;
    for (let device of devices) {
        for (let ping of device.ping_records) {
            pings += 1;
            if (!ping.responded) {
            unresponsive += 1;
            }
        }
        }
        if (unresponsive > 0) {
        statusColor = "orange";
        if (unresponsive == pings) {
            statusColor = "red";
        }
    }
    return statusColor;
  }
  render() {
    let element: any;
    let tbodys:any = [];
    console.log(this.state.Sites)

    let key:number = 0;
    this.state.Sites.forEach((s:Site) => {
        let tbody:any = {};
        let statusColor:string = this.checkRespondedColor(s.devices);
        tbody = (<TableBody key={key}>
                    <TableRow
                        hover
                        key={0}
                        id="tableRow"
                        onClick={this.state.UpdateSite.bind(this, s)} 
                        selected={this.state.SelectedSite.site_recid === s.site_recid}
                    >
                        <TableCell className="responseCircle">
                        <div style={{backgroundColor: statusColor}}></div>
                        </TableCell>
                        <TableCell>{s.description}</TableCell>
                        <TableCell>{"response time here"}</TableCell>
                        <TableCell>report</TableCell>
                    </TableRow> 
                    </TableBody>)
        key += 1;
        tbodys.push(tbody);
        if(s.devices.length !== 0){
            let should_display:boolean = s.site_recid === this.state.SelectedSite.site_recid? true:false;
            let device_tbody:any = <DeviceBody Devices={s.devices} tabular={true} display={should_display} num={key}/>
            tbodys.push(device_tbody);
            key++;
        }
    })

    if(tbodys.length === 0){
        tbodys = <div></div>
    }
    element = (<Paper className={"tableroot"}>
    <Table className={"tablebody"}>
        <TableHead>
        <TableRow>
            <TableCell>Status</TableCell>
            <TableCell numeric>Name</TableCell>
            <TableCell numeric>Last Response</TableCell>
            <TableCell numeric>Report</TableCell>
        </TableRow>
        </TableHead>
        {tbodys}
    </Table>
    </Paper>)
    return element;
  }
}