import * as React from "react";

export const MuiButton : typeof import("@material-ui/core/Button").default = require("@material-ui/core/Button").default;

import {sweepToBottom} from "./../../renderer/styles/sweepToBottom";
import { sweepToTop } from '../styles/sweepToTop';

export interface ButtonProps
{
    label : string;
    type : "advance" | "retreat";
    id? : string;
    onClick? : (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function Button(props : ButtonProps) : JSX.Element 
{
    return (
        <MuiButton
            variant="contained"
            className={props.type == "advance" ? sweepToBottom : props.type == "retreat" ? sweepToTop : ""}
            id={props.id} 
            onClick={props.onClick}
        >
            {props.label}
        </MuiButton>
    );
}
