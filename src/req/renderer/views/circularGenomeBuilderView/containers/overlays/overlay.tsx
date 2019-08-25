import * as React from "react";

import { Drawer } from '../../../../components/drawer';
import { Grid } from '../../../../components/grid';
import { BorderLeftOutlined } from '../../../../components/icons/borderLeftOutlined';
import { IconButton } from '../../../../components/iconButton';
import { blue } from '../../../../styles/colours';
import { BorderTopOutlined } from '../../../../components/icons/borderTopOutlined';
import { BorderBottomOutlined } from '../../../../components/icons/borderBottomOutlined';
import { BorderRightOutlined } from '../../../../components/icons/borderRightOutlined';
import { BorderHorizontalOutlined } from '../../../../components/icons/borderHorizontalOutlined';
import { Dialog } from '../../../../components/dialog';

export interface OverlayProps {
    kind: "drawerLeft" | "drawerRight" | "drawerBottom" | "drawerTop" | "modal";
    passThrough: {
        open: boolean;
        onClose: () => void;
    }
    children: JSX.Element;
}

function IconKindSelect(props: {
    kind: OverlayProps["kind"],
    setOverlayKind: (newKind: OverlayProps["kind"]) => void
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
                </Grid>
            </Grid>
        </div>
    );
}

export function Overlay(props: OverlayProps): JSX.Element | null {
    let [kind, setKind] = React.useState(props.kind);

    switch (kind) {
        case "drawerLeft":
            return (
                <Drawer
                    anchor="left"
                    {...props.passThrough}
                >
                    <React.Fragment>
                        <IconKindSelect kind={kind} setOverlayKind={setKind} />
                        {props.children}
                    </React.Fragment>
                </Drawer>
            );
        case "drawerTop":
            return (
                <Drawer
                    anchor="top"
                    {...props.passThrough}
                >
                    <React.Fragment>
                        <IconKindSelect kind={kind} setOverlayKind={setKind} />
                        {props.children}
                    </React.Fragment>
                </Drawer>
            );
        case "drawerBottom":
            return (
                <Drawer
                    anchor="bottom"
                    {...props.passThrough}
                >
                    <React.Fragment>
                        <IconKindSelect kind={kind} setOverlayKind={setKind} />
                        {props.children}
                    </React.Fragment>
                </Drawer>
            );
        case "drawerRight":
            return (
                <Drawer
                    anchor="right"
                    {...props.passThrough}
                >
                    <React.Fragment>
                        <IconKindSelect kind={kind} setOverlayKind={setKind} />
                        {props.children}
                    </React.Fragment>
                </Drawer>
            );
        case "modal":
            return (
                <Dialog
                    {...props.passThrough}
                >
                    <React.Fragment>
                        <IconKindSelect kind={kind} setOverlayKind={setKind} />
                        {props.children}
                    </React.Fragment>
                </Dialog>
            );
    }

    return null;
}
