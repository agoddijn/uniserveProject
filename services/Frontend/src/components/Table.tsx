import * as React from "react";
import { Site, Device, PingRecord } from 'uniserve.m8s.types';
import { DeviceTable } from './DeviceTable';
import {
    SortingState, SelectionState, FilteringState,
    LocalFiltering, LocalSorting, DataTypeProvider, RowDetailState
} from '@devexpress/dx-react-grid';

import {
    Grid,
    TableView, TableHeaderRow, TableFilterRow, TableSelection, DragDropContext, TableRowDetail
} from '@devexpress/dx-react-grid-material-ui';
import Collapse from 'material-ui/transitions/Collapse';

export class Table extends React.Component<{ sites: Site[], SelectSite: any }, { rows: any, columns: any, SelectSite: any, selection: any, expanded: any }>{
    constructor(props: { sites: Site[], SelectSite: any }) {
        super(props);

        this.state = {
            columns: [
                { name: 'status', title: 'Status', dataType: 'status' },
                { name: 'site', title: 'Site' },
                { name: 'response', title: 'Response (ms)' },
                { name: 'report', title: 'Report', getCellValue: (row: any) => row.siteID }
            ],
            rows: this.generateRows(this.props.sites),
            SelectSite: {},
            selection: [0],
            expanded: []
        };
    }
    componentWillReceiveProps(next: { sites: Site[], SelectSite: any }) {
        let siteData = this.generateRows(next.sites);
        this.setState({ rows: siteData, SelectSite: next.SelectSite });
    }
    handleRowSelection(selection: any) {
        let selected = [selection[selection.length - 1]]
        let empty = [];
        if (selection.length > 1) {
            this.setState({selection: selected, expanded: empty});
            this.state.SelectSite(this.state.rows[selection[selection.length - 1]].siteID);
        } else {
            if (this.state.expanded.length == 1) {
                this.setState({ expanded: empty});
            } else {
                this.setState({ expanded: this.state.selection});
            }
        }
    }
    rowDetailTemplate(detailContent: any) {
        return (
            <div className={"row-detail"}>
                <h6> Devices: </h6>
                <div>
                    <DeviceTable devices={detailContent.row.devices} />
                </div>
            </div>)
    }
    generateRows(sites: Site[]) {
        var data = [];
        for (let site of sites) {
            var status = "green", pings = 0, unresponsive = 0, avResponse = 0;
            for (let device of site.devices) {
                for (let record of device.ping_records) {
                    pings += 1;
                    if (!record.responded) unresponsive += 1;
                    avResponse += record.ms_response;
                }
            }
            avResponse = Math.round(avResponse / (pings - unresponsive));
            if (unresponsive > 0 || pings == 0) {
                status = "orange";
                if (unresponsive == pings) status = "red";
            }
            var record = {
                site: site.description,
                devices: site.devices,
                status: status,
                response: avResponse,
                siteID: site.site_recid
            };
            data.push(record);
        }
        return data;
    }
    render() {
        const { rows, columns, selection, expanded} = this.state;
        return (
            <Grid
                rows={rows}
                columns={columns}
            >
                <DataTypeProvider
                    type='status'
                    formatterTemplate={(value: any) => {
                        return (<span className="responseCircle"><div style={{ backgroundColor: value.value }}></div></span>)
                    }}
                />
                <FilteringState 
                    defaultFilters={[]}
                />
                <SortingState
                    defaultSorting={[
                        { columnName: 'status', direction: 'desc' }
                    ]}
                />
                <RowDetailState 
                    expandedRows={expanded} 
                />
                <SelectionState 
                    selection={selection} 
                    onSelectionChange={this.handleRowSelection.bind(this)}
                />

                <LocalFiltering />
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

                <DragDropContext />
                <TableView />
                <TableHeaderRow 
                    allowSorting 
                    allowDragging 
                />
                <TableFilterRow 
                    
                />
                <TableSelection 
                    selectByRowClick  
                    highlightSelected 
                    showSelectionColumn={false}
                />
                <TableRowDetail
                    detailRowTemplate={this.rowDetailTemplate}
                />
            </Grid>
        );
    }
}