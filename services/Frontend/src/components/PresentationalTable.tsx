import * as React from "react";
import { Device } from "../../commonTypes/Device";
import { ContainerBar } from "./PresentationalContainerBar"
import { DataType } from "./TabularViewContainer"
var PropTypes = require('prop-types')
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';


export class PresentationalTable extends React.Component<any, {}> {
    constructor(props: any) {
        super(props);
    }
    render() {
        return (
    <Paper className={"tableroot"}>
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
          {this.props.data.map((n:DataType,key:number) => {
            let colorCode:string;
            if(n.response_time>100){
                colorCode = "red"
            }else{
                colorCode = "green"
            }
            return (
                <TableRow key={key}>
                    <td className="responseCircle"></td>
                    <TableCell>{n.name}</TableCell>
                    <TableCell numeric>{n.usage + "G"}</TableCell>
                    <TableCell>{n.time_stamp}</TableCell>
                    <TableCell>report</TableCell>
                </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
    }
}