import * as React from "react";
import { Site } from "uniserve.m8s.types";
import IconButton from 'material-ui/IconButton';
import FileDownload from 'material-ui-icons/FileDownload';
import Button from 'material-ui/Button';
import * as jsPDF  from 'jspdf';

export class PresentationalReport extends React.Component<{SelectedSite: any}, {}> {
    constructor(props: {SelectedSite: Site}) {
        super(props);
    }

    createPDF() {
        let doc = new jsPDF();
        
        doc.text('Hello world!', 10, 10);
        doc.save('report_1.pdf');
    }
 
    render() {
        return <div className={"container-inner"}>
        fasdfsdfsdfsd
            <IconButton onClick={this.createPDF}>
                <FileDownload style={{color: "black"}}/>
            </IconButton>
        </div>;
    }
}