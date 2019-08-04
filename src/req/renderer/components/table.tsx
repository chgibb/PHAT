import * as React from "react";

import {tableCell} from "../../renderer/styles/tableCell";

import {tableIcons} from "./tableIcons";

const MuiTableDefault : typeof import("material-table").default = require("material-table").default;

let MuiTable : NonNullable<typeof MuiTableDefault>;
let MuiTableDefaultProps : NonNullable<typeof MuiTable["defaultProps"]>;
let MuiTableDefaultPropsOptions : NonNullable<typeof MuiTableDefaultProps.options>;
let MuiTableDefaultPropsColumns : NonNullable<typeof MuiTableDefaultProps.columns>;

type Row<T> = T & {
    tableData : {
        id : number
    }
};

type TableColumn<T> = Omit<Omit<typeof MuiTableDefaultPropsColumns,"render">,"field"> & {
    render? : (row : Row<T>) => string | number | boolean | JSX.Element;
    searchable : boolean;
    field : keyof T | "" | undefined;
    hidden : boolean;
};

export interface TableProps<T>
{
    title : typeof MuiTableDefaultProps.title;
    actions? : typeof MuiTableDefaultProps.actions;
    actionsColumnIndex? : typeof MuiTableDefaultPropsOptions.actionsColumnIndex;
    selection? : typeof MuiTableDefaultPropsOptions.selection;
    detailPanel? : typeof MuiTableDefaultProps.detailPanel;
    onSelectionChange? : typeof MuiTableDefaultProps.onSelectionChange;
    pageSize? : typeof MuiTableDefaultPropsOptions.pageSize;
    pageSizeOptions? : typeof MuiTableDefaultPropsOptions.pageSizeOptions;
    data : Array<T>;
    columns : Array<TableColumn<T>>;
    onRowClick? : (
            event? : React.MouseEvent,
            row? : Row<T>,
            toggleDetailPanel? : (i : number) => void) => void | undefined;
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
                columns={this.props.columns as any}
                data={this.props.data}
                onRowClick={this.props.onRowClick}
                detailPanel={this.props.detailPanel} 
            />
        );
    }
}

