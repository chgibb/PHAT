import * as React from "react";

export interface TabContainerProps
{
    children : React.ReactNode;
    dir : string;
}

/**
 * Wrap tab components
 *
 * @export
 * @param {TabContainerProps} {children,dir} - Component properties
 * @returns {JSX.Element}
 */
export function TabContainer({children,dir} : TabContainerProps) : JSX.Element
{
    return (
        <div>
            {children}
        </div>
    );
}
