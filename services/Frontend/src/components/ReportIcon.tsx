import * as React from "react";
import { Site } from 'uniserve.m8s.types';
import IconButton from 'material-ui/IconButton';
import Assessment from 'material-ui-icons/Assessment';
// 

export class ReportIcon extends React.Component<{ SiteID: number, SetLayout: any, SelectSite: any }, { SiteID: number }> {
    constructor(props: { SiteID: number, SetLayout: any, SelectSite: any }) {
        super(props);
        this.state = {
            SiteID: 0
        }
    }
    componentWillReceiveProps(next: { SiteID: number }) {
        this.setState({ SiteID: next.SiteID });
    }

    openReportWindow(e) {
        e.preventDefault();
        this.props.SelectSite(this.state.SiteID);
        this.props.SetLayout("report");
    }

    render() {
        return (
            <IconButton onClick={this.openReportWindow.bind(this)}>
                    <Assessment className={"report-icon"} />
            </IconButton>
        )
    }
}