import * as React from "react";
import { Site, Device, PingRecord } from 'uniserve.m8s.types';
import { DeviceTable } from './DeviceTable';
import { ReportIcon } from './ReportIcon';
import { TableCell, Input } from 'material-ui';
import {
    SortingState, SelectionState, FilteringState,
    LocalFiltering, LocalSorting, DataTypeProvider, RowDetailState
} from '@devexpress/dx-react-grid';

import {
    Grid,
    TableView, TableHeaderRow, TableFilterRow, TableSelection, DragDropContext, TableRowDetail
} from '@devexpress/dx-react-grid-material-ui';
import Collapse from 'material-ui/transitions/Collapse';

const FilterCell = ({ filter, setFilter, placeholder }) => (
    <TableCell style={{paddingLeft: "8px"}}>
        <Input
            style={{width: "95px"}}
            type="string"
            value={filter ? filter.value : ''}
            onChange={e => setFilter(e.target.value ? { value: e.target.value } : null)}
            placeholder={placeholder}
        />
    </TableCell>
)


export class Table extends React.Component<{ SetLayout: any, sites: Site[], SelectSite: any, SelectedSite: any }, { rows: any, columns: any, SelectSite: any, selection: any, expanded: any}>{
    constructor(props: { SetLayout: any, sites: Site[], SelectSite: any, SelectedSite: any }) {

        super(props);

        this.state = {
            columns: [
                { name: 'status', title: 'Status', dataType: 'status' },
                { name: 'site', title: 'Site' },
                { name: 'response', title: 'Response (ms)' },
                { name: 'report', title: 'Report', getCellValue: (row: any) => <ReportIcon SiteID={row.siteID} SetLayout={this.props.SetLayout} SelectSite={this.props.SelectSite} />}

            ],
            rows: this.generateRows(this.props.sites),
            SelectSite: props.SelectSite,
            selection: [0],
            expanded: []
        };
    }
    componentWillReceiveProps(next: { sites: Site[], SelectSite: any, SelectedSite: any }) {
        let siteData = this.generateRows(next.sites);
        let changed: boolean = false;
        let index = this.state.selection[0];
        if (siteData.length > 0 && next.SelectedSite) {
            for (let i = 0; i < siteData.length; i++) {
                if (siteData[i].siteID == next.SelectedSite.site_recid) {
                    if (i != index) changed = true;
                    index = i;
                    break;
                }
            }
        }
        this.setState({ rows: siteData, SelectSite: next.SelectSite, selection: [index], expanded: changed ? [] : this.state.expanded });
    }
    handleRowSelection(selection: any) {
        let selected = [selection[selection.length - 1]]
        let empty = [];
        if (selection.length > 1) {
            this.setState({ selection: selected, expanded: empty });
            this.state.SelectSite(this.state.rows[selection[selection.length - 1]].siteID);
        } else {
            if (this.state.expanded.length == 1) {
                this.setState({ expanded: empty });
            } else {
                this.setState({ expanded: this.state.selection });
            }
        }
    }
    rowDetailTemplate(detailContent: any) {
        return (
            <div className={"row-detail"}>
                <h6> Devices: </h6>
                <DeviceTable devices={detailContent.row.devices} />
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
    responseFilter(value, filter) {
        let firstChar = filter.value.charAt(0);
        if (firstChar == '>' || firstChar == '<') {
            let val = filter.value.substr(1, filter.value.length - 1);
            if (firstChar == '>') return value >= val;
            if (firstChar == '<') return value <= val;
            return value == val;
        }
        return value == filter.value;
    }
    getColumnPredicate = columnName => (
        (columnName == 'response') ? this.responseFilter : undefined
    )
    render() {
        const { rows, columns, selection, expanded } = this.state;
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

                <LocalFiltering
                    getColumnPredicate={this.getColumnPredicate}
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

                <DragDropContext />
                <TableView />
                <TableHeaderRow
                    allowSorting
                    allowDragging
                />
                <TableFilterRow
                    filterCellTemplate={({ column, filter, setFilter }) => {
                        if (column.name === 'status' || column.name === 'report') {
                            return <p></p>
                        }
                        if (column.name === 'response') {
                            return <FilterCell filter={filter} setFilter={setFilter} placeholder={"e.g. <10, 10, >10"} />;
                        }
                        return <FilterCell filter={filter} setFilter={setFilter} placeholder={"Filter..."} />;
                    }}
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