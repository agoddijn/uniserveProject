import * as React from "react";

export class MapIframeContainer extends React.Component<any, {MAP_API_KEY:string}> {
    constructor(props: any) {
        super(props);
        this.state = {MAP_API_KEY: "AIzaSyBPUUMxqRaHjBgeaedmPmBHBjWfmEFihiw"}
    }
    render() {
        return <iframe id='map' src={"https://www.google.com/maps/embed/v1/view?key=" + this.state.MAP_API_KEY  + "&center=64,-96&zoom=3&maptype=roadmap"}></iframe>;
    }
}