import * as React from "react";

export interface TabContainerProps
{
    children : React.ReactNode;
    dir : string;
}

export function TabContainer({children,dir} : TabContainerProps) : JSX.Element
{
    return (
        <div>
            {children}
        </div>
    );
}
