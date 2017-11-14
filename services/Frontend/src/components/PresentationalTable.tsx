import * as React from "react";
import { Site, Device } from "uniserve.m8s.types"
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { DeviceTable } from './DeviceTable';

export class PresentationalTable extends React.Component<{ Sites: Site[], tabular: boolean, SelectSite: any}, { Sites:Site[], UpdateSite: any, SelectedSite: any }> {
  constructor(props: { Sites: Site[], tabular: boolean, SelectSite: any}) {
    super(props);
    this.state = {
      Sites:[],
      UpdateSite: this.updateSite,
      SelectedSite: {}
    }
  }
  componentWillReceiveProps(next: { Sites: Site[]}) {
    this.setState({ Sites:next.Sites });
  }
  updateSite(n: Site, e: any) {
    this.props.SelectSite(n);
    this.setState({ SelectedSite: n });
  }
  render() {
    let element: any;
      element = (<Paper className={"tableroot"}>
        <Table className={"tablebody"}>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell numeric>Site / Device</TableCell>
              <TableCell numeric>Response (ms)</TableCell>
              <TableCell numeric>Report</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.Sites.map((n: Site, key: number) => {
              var buffer = [];
              var statusColor = "green";
              var unresponsive = 0, pings = 0, averageResponse = 0;
              for (let device of n.devices) {
                for (let ping of device.ping_records) {
                  pings += 1;
                  if (!ping.responded) {
                    unresponsive += 1;
                  } else {
                    averageResponse += ping.ms_response;
                  }
                }
              }
              averageResponse = Math.round(averageResponse / (pings - unresponsive));
              if (unresponsive > 0) {
                statusColor = "orange";
                if (unresponsive == pings) {
                  statusColor = "red";
                }
              }
              buffer.push(
                <TableRow
                  hover
                  key={key}
                  id="tableRow"
                  onClick={this.state.UpdateSite.bind(this, n)}
                  selected={this.state.SelectedSite.site_recid === n.site_recid}>
                  <TableCell>
                    <td className="responseCircle"><div style={{ backgroundColor: statusColor, marginLeft: "5px" }}></div></td>
                  </TableCell>
                  <TableCell>{n.description}</TableCell>
                  <TableCell>{averageResponse}</TableCell>
                  <TableCell>report</TableCell>
                </TableRow>            
              );
              if (this.state.SelectedSite.site_recid === n.site_recid) {
                buffer.push(<DeviceTable devices={n.devices}></DeviceTable>);
              }        
              return buffer;
            })}
          </TableBody>
        </Table>
      </Paper>)

    return element;
  }
}