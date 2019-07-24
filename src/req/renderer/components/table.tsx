import * as React from "react";

import {tableCell} from "../../renderer/styles/tableCell";
import {SubTableContainer} from "../containers/subTableContainer";

import {tableIcons} from "./tableIcons";

export const MuiTable : typeof import("material-table").default = require("material-table").default;

type Row<T> = T & {
    tableData : {
        id : number
    }
};

type TableColumn<T> = Omit<typeof MuiTable.defaultProps.columns[number],"render"> & {
    render? : (row : Row<T>) => string | number | boolean | JSX.Element;
} & {
    searchable : boolean;
} & {
    field : string;
} & {
    hidden : boolean;
};

export interface SubTableProps
{
    isSubTable : boolean;
    nesting : number;
}

export interface TableProps<T>
{
    title : typeof MuiTable.defaultProps.title;
    actions? : typeof MuiTable.defaultProps.actions;
    actionsColumnIndex? : typeof MuiTable.defaultProps.options.actionsColumnIndex;
    selection? : typeof MuiTable.defaultProps.options.selection;
    detailPanel? : typeof MuiTable.defaultProps.detailPanel;
    onSelectionChange? : typeof MuiTable.defaultProps.onSelectionChange;
    pageSize? : typeof MuiTable.defaultProps.options.pageSize;
    pageSizeOptions? : typeof MuiTable.defaultProps.options.pageSizeOptions;
    subTableProps? : SubTableProps;
    data? : Array<T>;
    columns : Array<TableColumn<T>>;
    onRowClick? : (
            event : React.MouseEvent<HTMLElement>,
            row : Row<T>,
            toggleDetailPanel : (i : number) => void) => void;
}

export function Table<T>(props : TableProps<T>) : JSX.Element
{
    let defaultPageSize : typeof props.pageSize = props.data ? props.data.length < 100 ? props.data.length : 100 : 5;
    let defaultPageSizeOptions : typeof props.pageSizeOptions = [defaultPageSize,500,1000];

    return (
        <MuiTable
            title={props.title}
            options={{
                toolbar : true,
                actionsColumnIndex : props.actionsColumnIndex ? props.actionsColumnIndex : 0,
                headerStyle: tableCell as any,
                rowStyle : tableCell as any,
                selection : props.selection,
                pageSize : props.pageSize ? props.pageSize : defaultPageSize,
                pageSizeOptions : props.pageSizeOptions ? props.pageSizeOptions : defaultPageSizeOptions,
                searchFieldAlignment : "left",
                columnsButton : true,
                toolbarButtonAlignment : "left",
                detailPanelColumnAlignment : "left"
            }}
            components={props.subTableProps && props.subTableProps.isSubTable ? {
                Container : (subProps) => 
                {
                    return SubTableContainer(subProps,props.subTableProps);
                }
            } : undefined}
            actions={props.actions}
            onSelectionChange={props.onSelectionChange}
            icons={tableIcons}
            columns={props.columns}
            data={props.data}
            onRowClick={props.onRowClick}
            detailPanel={props.detailPanel} 
        />
    );
}

