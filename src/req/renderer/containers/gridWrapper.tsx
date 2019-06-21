import  * as React from "react";

import { gridWrapper } from '../styles/gridWrapper';

export interface GridWrapperProps
{
    children : JSX.Element;
}

export function GridWrapper(props : GridWrapperProps) : JSX.Element
{
    return (
        <div className={gridWrapper}>
            {props.children}
        </div>
    );
}
