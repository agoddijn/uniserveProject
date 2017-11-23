import * as React from "react";
import { Site } from "uniserve.m8s.types";
import IconButton from 'material-ui/IconButton';
import FileDownload from 'material-ui-icons/FileDownload';
import Button from 'material-ui/Button';
import jsPDF from 'jspdf';

export class PresentationalReport extends React.Component<{SelectedSite: any}, {}> {
    constructor(props: {SelectedSite: Site, SetLayout: any}) {
        super(props);
    }
 
    render() {
        return <div>
         <Button  raised dense>
            <FileDownload  />
            Download PDF
        </Button>
        </div>;
    }
}