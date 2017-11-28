import * as React from "react";
import { Device } from "uniserve.m8s.types"
var PropTypes = require('prop-types')
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';

import {
    SortingState, SelectionState, FilteringState, PagingState, GroupingState,
    LocalFiltering, LocalGrouping, LocalPaging, LocalSorting, DataTypeProvider, RowDetailState
  } from '@devexpress/dx-react-grid';
  
  import {
    Grid,
    TableView, TableHeaderRow, TableFilterRow, TableSelection, TableGroupRow,
    PagingPanel, GroupingPanel, DragDropContext, TableColumnReordering, TableRowDetail
  } from '@devexpress/dx-react-grid-material-ui';

export class DeviceTable extends React.Component<{ devices: Device[] }, any> {
    constructor(props: { devices: Device[] }) {
        super(props);

        this.state = {
            columns: [
                { name: 'status', title: 'Status', dataType: 'status' },
                { name: 'device', title: 'Device'},
                { name: 'response', title: 'Response (ms)' }
            ],
            rows: this.generateRows(this.props.devices)
        }
    }
    generateRows(devices: Device[] ) {
        var data = [];
        for (let device of devices) {
            var status = "green", pings = 0, unresponsive = 0, avResponse = 0;
            for (let record of device.ping_records) {
                pings += 1;
                if (!record.responded) unresponsive += 1;
                avResponse += record.ms_response;
            }
            avResponse = Math.round(avResponse / (pings - unresponsive));
            if (unresponsive > 0 || pings == 0) {
                status = "orange";
                if (unresponsive == pings) status = "red";
            }
            var record = {
                device: device.description,
                status: status,
                response: avResponse
            };
            data.push(record);
        }
        return data;
    }
    render() {
        const {rows, columns } = this.state;
        return(
            <Grid
                rows={rows}
                columns={columns}
            >
                <SortingState
                    defaultSorting={[
                        { columnName: 'status', direction: 'desc' }
                    ]}
                />
                <DataTypeProvider
                    type = 'status'
                    formatterTemplate = {(value: any) => {
                        return(<span className="responseCircle"><div style={{ backgroundColor: value.value}}></div></span>)
                    }} 
                />
                <LocalSorting 
                    getColumnCompare={(columnName: string) => {
                        if (columnName == 'status') {
                            return (a: any, b: any) => {
                                let order = [
                                    'green',
                                    'orange',
                                    'red'
                                ]
                                return (order.indexOf(a) - order.indexOf(b));
                            }
                        }
                        return undefined;
                    }}
                />
                <TableView />
                <TableHeaderRow allowSorting/>
            </Grid>
        )
    }
}