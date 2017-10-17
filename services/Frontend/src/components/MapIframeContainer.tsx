import * as React from "react";

export class MapIframeContainer extends React.Component<any, {MAP_API_KEY:string}> {
    constructor(props: any) {
        super(props);
        this.state = {MAP_API_KEY: "KAJ2"}
    }
    render() {
        return <iframe src={"https://www.google.com/maps/embed/v1/view?key=" + this.state.MAP_API_KEY  + "&center=-33.8569,151.2152&zoom=18&maptype=roadmap"}></iframe>;
    }
}