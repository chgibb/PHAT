import * as React from "react";


import {tableCell} from "../../renderer/styles/tableCell";

import {tableIcons} from "./tableIcons";

export const MuiTable : typeof import("material-table").default = require("material-table").default;

export interface TableProps<T>
{
    toolbar : typeof MuiTable.defaultProps.options.toolbar;
    title : typeof MuiTable.defaultProps.title;
    columns : typeof MuiTable.defaultProps.columns;
    actions? : typeof MuiTable.defaultProps.actions;
    actionsColumnIndex? : typeof MuiTable.defaultProps.options.actionsColumnIndex;
    data : Array<T>;
}

export function Table<T>(props : TableProps<T>) : JSX.Element
{
    return (
        <MuiTable
            title={props.title}
            options={{
                toolbar : props.toolbar,
                actionsColumnIndex : props.actionsColumnIndex ? props.actionsColumnIndex : 0,
                headerStyle: tableCell as any,
                rowStyle : tableCell as any
            }}
            actions={props.actions}
            icons={tableIcons}
            columns={props.columns}
            data={props.data}
        />
    );
}

