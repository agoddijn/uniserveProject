import * as React from "react";
import { Site } from "uniserve.m8s.types"
import { ContainerBar } from "./PresentationalContainerBar"
var PropTypes = require('prop-types')
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

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
              <TableCell numeric>Name</TableCell>
              <TableCell numeric>Last Response</TableCell>
              <TableCell numeric>Report</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.Sites.map((n: Site, key: number) => {
              var statusColor = "green";
              var unresponsive = 0, pings = 0;
              for (let device of n.devices) {
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
              return (
                <TableRow
                  hover
                  key={key} 
                  id="tableRow"
                  onClick={this.state.UpdateSite.bind(this, n)} 
                  selected={this.state.SelectedSite.site_recid === n.site_recid}
                >
                  <TableCell>
                    <td className="responseCircle"><div style={{backgroundColor: statusColor}}></div></td>
                  </TableCell>
                  <TableCell>{n.description}</TableCell>
                  <TableCell>{"response time here"}</TableCell>
                  <TableCell>report</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>)

    return element;
  }
}