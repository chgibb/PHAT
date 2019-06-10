import * as React from "react";

export const MuiTable : typeof import("material-table").default = require("material-table").default;

import { tableCell } from '../renderer/styles/tableCell';
import { tableIcons } from './tableIcons';

export interface TableProps<T>
{
    toolbar : typeof MuiTable.defaultProps.options.toolbar;
    title : typeof MuiTable.defaultProps.title;
    columns : typeof MuiTable.defaultProps.columns;
    data : Array<T>;
}

export function Table<T>(props : TableProps<T>) : JSX.Element
{
    return (
        <MuiTable
            title={props.title}
            options={{
                toolbar : props.toolbar,
                headerStyle: tableCell as any,
                rowStyle : tableCell as any
            }}
            icons={tableIcons}
            columns={props.columns}
            data={props.data}
        />
    );
}

