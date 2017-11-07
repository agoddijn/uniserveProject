import * as React from "react";
import { Device } from "../../../../modules/common_types/types/Device"
import { ContainerBar } from "./PresentationalContainerBar"
var PropTypes = require('prop-types')
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';


export class PresentationalTable extends React.Component<{Devices:Device[],tabular:boolean}, any> {
  constructor(props: {Devices:Device[],tabular:boolean}) {
    super(props);
  }
  render() {
    let element:any;
    if(this.props.tabular){
      element = (<Paper className={"tableroot"}>
      <Table className={"tablebody"}>
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell numeric>Name</TableCell>
            <TableCell numeric>Usage</TableCell>
            <TableCell numeric>Last Response</TableCell>
            <TableCell numeric>Report</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.Devices.map((n: Device, key: number) => {
            {/* let colorCode:string = n.response_time>100? "red":"green"; */}
            let colorCode:string = "green";
            let resStyle = { backgroundColor: colorCode, borderRadius: '50%', width: '30px', height: '30px', marginLeft: '1.5vw' };
            let backgroundColorCode:string = key%2 === 0? "#e6e6e6" : "white";
            return (
              <TableRow key={key} style={{backgroundColor:backgroundColorCode}}>
                <td className="responseCircle"><div style={resStyle}></div></td>
                <TableCell>{n.device_id}</TableCell>
                <TableCell numeric>{"30" + "G"}</TableCell>
                <TableCell>{"response time here"}</TableCell>
                <TableCell>report</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>)
    }else {
      element = (<Paper className={"tableroot"}>
      <Table className={"tablebody"}>
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell numeric>Name</TableCell>
            <TableCell numeric>Report</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.Devices.map((n: Device, key: number) => {
            {/* let colorCode:string = n.response_time>100? "red":"green"; */}
            let colorCode:string = "green";
            let resStyle = { backgroundColor: colorCode, borderRadius: '50%', width: '30px', height: '30px', marginLeft: '1.5vw' };
            let backgroundColorCode:string = key%2 === 0? "#e6e6e6" : "white";
            return (
              <TableRow key={key} style={{backgroundColor:backgroundColorCode}}>
                <td className="responseCircle"><div style={resStyle}></div></td>
                <TableCell>{n.device_id}</TableCell>
                <TableCell>report</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>)
    }
    return element;
  }
}