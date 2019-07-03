import * as React from "react";

import {Paper} from "../components/paper";

export function SubTableContainer(props : any) : JSX.Element
{
    return (
        <Paper {...props} style={{maxWidth: "100%",display: "grid"}} />
    );
}
