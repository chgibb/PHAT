import  * as React from "react";

import {gridWrapper} from "../styles/gridWrapper";

export interface GridWrapperProps
{
    children : JSX.Element;
}

/**
 * Should be used to wrap Mui's <Grid> component
 *
 * @export
 * @param {GridWrapperProps} props - Component properties
 * @returns {JSX.Element}
 */
export function GridWrapper(props : GridWrapperProps) : JSX.Element
{
    return (
        <div className={gridWrapper}>
            {props.children}
        </div>
    );
}
