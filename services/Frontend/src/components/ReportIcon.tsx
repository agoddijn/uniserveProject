import * as React from "react";
import { Site } from 'uniserve.m8s.types';
import IconButton from 'material-ui/IconButton';
import Assessment from 'material-ui-icons/Assessment';

export class ReportIcon extends React.Component<{SiteID: number},{SiteID: number}> {
    constructor(props: {SiteID: number}) {
        super(props);
        this.state = {
            SiteID: 0
        }
    }
    componentWillReceiveProps(next: {SiteID: number}) {
        this.setState({SiteID: next.SiteID});
    }
    render() {
        return (
            <IconButton>
                <Assesment />
            </IconButton>
        )
    }
}