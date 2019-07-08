import * as React from "react";

import {Paper} from "../components/paper";
import {SubTableProps} from "../components/table";

export interface SubTableContainerProps
{
    children : JSX.Element;
}

export function SubTableContainer(props : SubTableContainerProps,subTableProps : SubTableProps) : JSX.Element
{
    return (
        <Paper style={{maxWidth: "100%",display: "grid"}}>
            <div style={{marginLeft : `${subTableProps.nesting*2}vh`}}>
                {props.children}
            </div>
        </Paper>
    );
}
