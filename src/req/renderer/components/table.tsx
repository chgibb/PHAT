import * as React from "react";

import {tableCell} from "../../renderer/styles/tableCell";

import {tableIcons} from "./tableIcons";

export const MuiTable : typeof import("material-table").default = require("material-table").default;

type Row<T> = T & {
    tableData : {
        id : number
    }
};

type TableColumn<T> = Omit<typeof MuiTable.defaultProps.columns[number],"render"|"field"> & {
    render? : (row : Row<T>) => string | number | boolean | JSX.Element;
    searchable : boolean;
    field : keyof T | "";
    hidden : boolean;
};

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
    data? : Array<T>;
    columns : Array<TableColumn<T>>;
    onRowClick? : (
            event : React.MouseEvent<HTMLElement>,
            row : Row<T>,
            toggleDetailPanel : (i : number) => void) => void;
}

export class Table<T> extends React.Component<TableProps<T>,{}>
{
    private renderKey = 0;
    public constructor(props : TableProps<T>)
    {
        super(props);
    }

    public componentDidUpdate()
    {
        this.renderKey += 1;
    }

    public render() : JSX.Element
    {
        let defaultPageSize = this.props.data ? this.props.data.length < 100 ? this.props.data.length : 100 : 5;
        let defaultPageSizeOptions  = [defaultPageSize,500,1000];

        return (
            <MuiTable
                key={this.renderKey}
                title={this.props.title}
                options={{
                    showTextRowsSelected : false,
                    toolbar : true,
                    actionsColumnIndex : this.props.actionsColumnIndex ? this.props.actionsColumnIndex : 0,
                    headerStyle: tableCell as any,
                    rowStyle : tableCell as any,
                    selection : this.props.selection,
                    pageSize : this.props.pageSize ? this.props.pageSize : defaultPageSize,
                    pageSizeOptions : this.props.pageSizeOptions ? this.props.pageSizeOptions : defaultPageSizeOptions,
                    searchFieldAlignment : "left",
                    columnsButton : true,
                    toolbarButtonAlignment : "left",
                    detailPanelColumnAlignment : "left"
                }}
                actions={this.props.actions}
                onSelectionChange={this.props.onSelectionChange}
                icons={tableIcons}
                columns={this.props.columns}
                data={this.props.data}
                onRowClick={this.props.onRowClick}
                detailPanel={this.props.detailPanel} 
            />
        );
    }
}

