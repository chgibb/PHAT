import * as React from "react";

export const MuiButton : typeof import("@material-ui/core/Button").default = require("@material-ui/core/Button").default;

import {sweepToBottom} from "../styles/sweepToBottom";
import { sweepToRight } from '../styles/sweepToRight';
import { sweepToLeft } from '../styles/sweepToLeft';

export interface ButtonProps
{
    label : string;
    type : "advance" | "retreat" | "remain";
    id? : string;
    onClick? : (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function Button(props : ButtonProps) : JSX.Element 
{
    return (
        <MuiButton
            variant="contained"
            className={props.type == "advance" ? sweepToLeft : props.type == "retreat" ? sweepToRight : props.type == "remain" ? sweepToBottom : ""}
            id={props.id} 
            onClick={props.onClick}
        >
            {props.label}
        </MuiButton>
    );
}
