import * as React from "react";
import { Device } from "uniserve.m8s.types";
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
            let resStyle = {backgroundColor: colorCode, borderRadius: '50%', width: '40px', height: '40px', marginLeft: '50px'};                        
            return (
                <TableRow key={key}>
                <td className="responseCircle"><div style={resStyle}></div></td>
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