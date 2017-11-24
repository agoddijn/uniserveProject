import * as React from "react";
import { Site } from "uniserve.m8s.types";
import IconButton from 'material-ui/IconButton';
import FileDownload from 'material-ui-icons/FileDownload';
import { SummaryChart } from "./SummaryChart";
import * as moment from 'moment';
import Button from 'material-ui/Button';
import * as jsPDF  from 'jspdf';

let pdfButton = {
    width: "100%",
    top: '-40px'
}

export class PresentationalReport extends React.Component<{SelectedSite: Site}, {}> {
    constructor(props: {SelectedSite: Site}) {
        super(props);
    }

    createPDF() {
        let site = this.props.SelectedSite;
        let doc = new jsPDF();
        const lineGraph = (document.getElementById("m8slinechart") as any).toDataURL();     
        
        //units are in mm
        doc.text(site.site_recid.toString(), 10, 10);
        doc.text("Address: " + site.address1, 10, 20);
        doc.addImage(lineGraph, 10, 20, 190, 100);        

        const filedate = "date_here";
        doc.save(`site_${site.site_recid}_${filedate}.pdf`);
    }
 
    render() {
        return <div>
            <Button style={pdfButton} onClick={this.createPDF.bind(this)}>
                Download as PDF
                <FileDownload style={{color: "black"}}/>
            </Button>

            <SummaryChart Site={this.props.SelectedSite} FromDate={"1"} ToDate={"1"}  />


        </div>;
    }
}