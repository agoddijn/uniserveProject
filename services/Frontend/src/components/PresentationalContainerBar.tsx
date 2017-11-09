import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon'


export const ContainerBar = (props: { Title: string }) => {
    return (<div className="AppBar">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className="layoutButton" color="contrast" aria-label="Menu">
                            <Icon color="primary" style={{ fontSize: 30 }}>
                                add_circle
                            </Icon>
                        </IconButton>
                        <h5 className="title">
                            {props.Title}
                        </h5>
                        <Button color="contrast">Gear</Button>
                    </Toolbar>
                </AppBar>
            </div>)
}
