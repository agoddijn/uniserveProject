import * as React from "react";
import { Device } from "uniserve.m8s.types"
import { ContainerBar } from "./PresentationalContainerBar"
var PropTypes = require('prop-types')
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

export class DeviceBody extends React.Component<{ Devices: Device[], tabular: boolean, display:boolean, num:number}, any> {
  constructor(props: { Devices: Device[], tabular: boolean, display:boolean, num:number}) {
    super(props);
  }

  render() {
    let tbody: any;
    let displayable:string = this.props.display?"visible":"collapse";
      tbody = (
          <TableBody key={this.props.num} style={{visibility:displayable}}>
            {this.props.Devices.map((d: Device, key: number) => {
              var statusColor = "green";
              return (
                <TableRow
                  hover
                  key={key} 
                  id="tableRow"
                  style={{backgroundColor: "lightgrey"}}
                >
                  <TableCell className="responseCircle">
                    <div style={{backgroundColor: statusColor}}></div>
                  </TableCell>
                  <TableCell>{d.description}</TableCell>
                  <TableCell>{"response time here"}</TableCell>
                  <TableCell>report</TableCell>
                </TableRow>
              );
            })}
          </TableBody>)

    return tbody;
  }
}