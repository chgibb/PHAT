import * as React from "react";

export const MuiButton : typeof import("@material-ui/core/Button").default = require("@material-ui/core/Button").default;

import {sweepToBottom} from "../../renderer/styles/sweepToBottom";

export interface ButtonProps
{
    label : string;
    id? : string;
    onClick? : (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function Button(props : ButtonProps) : JSX.Element 
{
    return (
        <MuiButton
            variant="contained"
            className={sweepToBottom}
            id={props.id} 
            onClick={props.onClick}
        >
            {props.label}
        </MuiButton>
    );
}
