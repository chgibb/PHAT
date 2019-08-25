import * as React from "react";
import Draggable from "react-draggable";

import { Drawer } from '../../../../components/drawer';
import { Grid } from '../../../../components/grid';
import { BorderLeftOutlined } from '../../../../components/icons/borderLeftOutlined';
import { IconButton } from '../../../../components/iconButton';
import { Paper, PaperProps } from "../../../../components/paper";
import { blue } from '../../../../styles/colours';
import { BorderTopOutlined } from '../../../../components/icons/borderTopOutlined';
import { BorderBottomOutlined } from '../../../../components/icons/borderBottomOutlined';
import { BorderRightOutlined } from '../../../../components/icons/borderRightOutlined';
import { BorderHorizontalOutlined } from '../../../../components/icons/borderHorizontalOutlined';
import { Dialog } from '../../../../components/dialog';
import { ChevronLeft } from '../../../../components/icons/chevronLeft';
import { ArrowUpwardOutlined } from '../../../../components/icons/arrowUpwareOutlined';
import { ArrowDownwardOutlined } from '../../../../components/icons/arrowDownwardOutlined';
import { ChevronRight } from '../../../../components/icons/chevronRight';
import { Close } from '../../../../components/icons/close';
import { style } from 'typestyle';


export interface OverlayProps {
    kind: "drawerLeft" | "drawerRight" | "drawerBottom" | "drawerTop" | "modal";
    onClose: () => void;
    open: boolean;
    children: JSX.Element;
}

function DraggablePaper(props: PaperProps) {
    return (
        <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

function IconKindSelect(props: {
    kind: OverlayProps["kind"],
    setOverlayKind: (newKind: OverlayProps["kind"]) => void,
    onClose: OverlayProps["onClose"]
}): JSX.Element {
    return (
        <div
            style={{ marginBottom: "3vh" }}>
            <Grid container spacing={1} justify="flex-start">
                <Grid item>
                    <IconButton
                        edge="start"
                        color={props.kind == "drawerLeft" ? "primary" : "default"}
                        classes={{ colorPrimary: blue }}
                        onClick={() => props.setOverlayKind("drawerLeft")}
                    >
                        <BorderLeftOutlined />
                    </IconButton>
                    <IconButton
                        edge="start"
                        color={props.kind == "drawerTop" ? "primary" : "default"}
                        classes={{ colorPrimary: blue }}
                        onClick={() => props.setOverlayKind("drawerTop")}
                    >
                        <BorderTopOutlined />
                    </IconButton>
                    <IconButton
                        edge="start"
                        color={props.kind == "drawerBottom" ? "primary" : "default"}
                        classes={{ colorPrimary: blue }}
                        onClick={() => props.setOverlayKind("drawerBottom")}
                    >
                        <BorderBottomOutlined />
                    </IconButton>
                    <IconButton
                        edge="start"
                        color={props.kind == "drawerRight" ? "primary" : "default"}
                        classes={{ colorPrimary: blue }}
                        onClick={() => props.setOverlayKind("drawerRight")}
                    >
                        <BorderRightOutlined />
                    </IconButton>
                    <IconButton
                        edge="start"
                        color={props.kind == "modal" ? "primary" : "default"}
                        classes={{ colorPrimary: blue }}
                        onClick={() => props.setOverlayKind("modal")}
                    >
                        <BorderHorizontalOutlined />
                    </IconButton>
                    <IconButton
                        edge="start"
                        color="primary"
                        classes={{ colorPrimary: blue }}
                        onClick={props.onClose}
                    >
                        {
                            props.kind == "drawerLeft" ? <ChevronLeft /> :
                                props.kind == "drawerTop" ? <ArrowUpwardOutlined /> :
                                    props.kind == "drawerBottom" ? <ArrowDownwardOutlined /> :
                                        props.kind == "drawerRight" ? <ChevronRight /> :
                                            props.kind == "modal" ? <Close /> :
                                                ""
                        }
                    </IconButton>
                </Grid>
            </Grid>
        </div>
    );
}

const drawer = style({
    marginTop: "6.5vh"
});

export function Overlay(props: OverlayProps): JSX.Element | null {
    let [kind, setKind] = React.useState(props.kind);

    switch (kind) {
        case "drawerLeft":
        case "drawerTop":
        case "drawerBottom":
        case "drawerRight":
            return (
                <Drawer
                    anchor={
                        kind == "drawerLeft" ? "left" :
                            kind == "drawerTop" ? "top" :
                                kind == "drawerBottom" ? "bottom" :
                                    kind == "drawerRight" ? "right" :
                                        "left"
                    }
                    variant={props.open ? "permanent" : "temporary"}
                    open={props.open}
                >
                    <div className={drawer}>
                        <React.Fragment>
                            <IconKindSelect kind={kind} setOverlayKind={setKind} onClose={props.onClose} />
                            {props.children}
                        </React.Fragment>
                    </div>
                </Drawer>
            );
        case "modal":
            return (
                <Dialog
                    open={props.open}
                    PaperComponent={DraggablePaper}
                    hideBackdrop={true}
                >
                    <React.Fragment>
                        <IconKindSelect kind={kind} setOverlayKind={setKind} onClose={props.onClose} />
                        {props.children}
                    </React.Fragment>
                </Dialog>
            );
    }

    return null;
}
