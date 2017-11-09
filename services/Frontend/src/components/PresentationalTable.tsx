import * as React from "react";
import { Site } from "uniserve.m8s.types"
import { ContainerBar } from "./PresentationalContainerBar"
var PropTypes = require('prop-types')
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';


export class PresentationalTable extends React.Component<{Sites:Site[],tabular:boolean, SelectSite: any}, {UpdateSite: any}> {
  constructor(props: {Sites:Site[],tabular:boolean,SelectSite:any}) {
    super(props);
    this.state = {
      UpdateSite: this.updateSite
    }
  }
  updateSite(n: Site, e: any) {
    this.props.SelectSite(n);
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
            <TableCell numeric>Last Response</TableCell>
            <TableCell numeric>Report</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.Sites.map((n: Site, key: number) => {
            {/* let colorCode:string = n.response_time>100? "red":"green"; */}
            let colorCode:string = "green";
            let resStyle = { backgroundColor: colorCode, borderRadius: '50%', width: '30px', height: '30px', marginLeft: '1.5vw' };
            let backgroundColorCode:string = key%2 === 0? "#e6e6e6" : "white";
            return (
              <TableRow key={key} id="tableRow" style={{backgroundColor:backgroundColorCode}} onClick={this.state.UpdateSite.bind(this,n)}>
                <td className="responseCircle"><div style={resStyle}></div></td>
                <TableCell>{n.description}</TableCell>
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
          {this.props.Sites.map((n: Site, key: number) => {
            {/* let colorCode:string = n.response_time>100? "red":"green"; */}
            let colorCode:string = "green";
            let resStyle = { backgroundColor: colorCode, borderRadius: '50%', width: '30px', height: '30px', marginLeft: '1.5vw' };
            let backgroundColorCode:string = key%2 === 0? "#e6e6e6" : "white";
            return (
              <TableRow key={key} style={{backgroundColor:backgroundColorCode}}>
                <td className="responseCircle"><div style={resStyle}></div></td>
                <TableCell>{n.description}</TableCell>
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