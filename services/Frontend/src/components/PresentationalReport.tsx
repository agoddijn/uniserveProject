import * as React from "react";
import { Site, Device } from "uniserve.m8s.types";
import IconButton from 'material-ui/IconButton';
import FileDownload from 'material-ui-icons/FileDownload';
import { SummaryContainer } from "./SummaryContainer";
import { SummaryPie } from "./SummaryPie";
import * as moment from 'moment';
import Button from 'material-ui/Button';
import * as jsPDF  from 'jspdf';

let pdfButton = {
    width: "100%"
}
const myFormat = 'YYYY-MM-DD[T]HH:mm';

export class PresentationalReport extends React.Component<{SelectedSite: Site}, {}> {
    constructor(props: {SelectedSite: Site}) {
        super(props);
    }

    createPDF() {
        let site = this.props.SelectedSite;
        let doc = new jsPDF();
        const lineGraph = (document.getElementById("m8slinechart") as any).toDataURL();
        
        let pies = [];
        for (let i = 0; i < site.devices.length*3; i++) {
            pies.push((document.getElementById("m8spiechart" + i) as any).toDataURL());
        }
        
        //units are in mm
        doc.setFontSize(25);
        doc.text("Uniserve Site Report - " + moment().format("MMMM Do YYYY"), 10, 15);
        doc.setFontSize(10);
        doc.text("Site ID: " + site.site_recid.toString(), 10, 25);
        doc.text("Site Description: " + site.description.toString(), 10, 30);
        doc.text("Address: " + site.address1, 10, 35);
        doc.addImage(lineGraph, 10, 40, 190, 100);  
        for (let i = 0; i < site.devices.length*3; i++) {
            let deviceNum = Math.floor(i/3);
            let device = site.devices[deviceNum];
            let height = 150 + (60 * deviceNum);
            let offset = 10 + (i % 3) * 60
            if (i % 3 == 0) {
                doc.text("Device " + device.device_recid + ": " + device.device_id + " - " + device.description, 10, height);
            }
            doc.addImage(pies[i], offset, height + 5, 70, 40);
        }
              

        const filedate = moment().format("MM[_]DD[_]YY");
        doc.save(`uniserve_report_site_${site.site_recid}__${filedate}.pdf`);
    }
 
    render() {
        let now = moment();
        let from = moment().subtract(1,'days');

        return <div>
            <Button style={pdfButton} onClick={this.createPDF.bind(this)}>
                Download as PDF
                <FileDownload style={{color: "black"}}/>
            </Button>

            <div style={{width: "90%", height: "400px", margin: "auto"}}>
                <SummaryContainer Site={this.props.SelectedSite} />
            </div>

            {this.props.SelectedSite.devices.map((d: Device, index: number) => {
                let buffer = [];
                for (let i = 3*index; i < 3*index + 3; i++) {
                    buffer.push(<SummaryPie device={d} hackID={i} />);
                }
                return (
                <div style={{width: "95%", margin: "auto", marginTop: "20px"}}>
                    <p>Device {d.device_recid}: {d.device_id} - {d.description}</p>
                    {buffer}
                </div>
                )
            })}
            
        </div>;
    }
}