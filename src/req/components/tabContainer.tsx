import * as React from 'react';

import { Typography } from './typography';

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
    )
}
