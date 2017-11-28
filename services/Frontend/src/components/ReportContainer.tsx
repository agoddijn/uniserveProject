import * as React from "react";
import { Site } from "uniserve.m8s.types";
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui-icons/Close';
import FileDownload from 'material-ui-icons/FileDownload';
import { PresentationalReport } from './PresentationalReport';

export class ReportContainer extends React.Component<{SelectedSite: any, SetLayout: any}, {}> {
    constructor(props: {SelectedSite: any, SetLayout: any}) {
        super(props);
    }
 
    render() {
        return <div className="myContainer">
            <div className={"container-bar"}>
                <h5 className="title">
                    Report
                </h5>

                <IconButton onClick={this.props.SetLayout.bind(this, "default")} className={"bar-button"} style={{height: "20%", top: "-25px"}}>
                    <Close style={{color: "white"}}/>
                </IconButton>
            </div>
            <div className={"container-inner"}>
                <PresentationalReport SelectedSite={this.props.SelectedSite} />
            </div>
        </div>;
    }
}