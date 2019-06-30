import * as React from "react";
import { sweepToBottom } from '../styles/sweepToBottom';

export interface TableCellHoverProps
{
    children : JSX.Element;
}

/**
 * Wrap Mui-Table instances in this component to enable hoverable table cells
 *
 * @export
 * @class TableCellHover
 * @extends {React.Component<TableCellHoverProps, {}>}
 */
export class TableCellHover extends React.Component<TableCellHoverProps,{}>
{
    private ref = React.createRef<HTMLDivElement>();
    public static cellHoverClass = "cellHover";

    public constructor(props : TableCellHoverProps)
    {
        super(props);
    }

    private updateStyles() : void
    {
        /*
            Mui-table will only register row clicks whenever the onRowClick callback is set. This also forces the cursor to be a pointer on the entire row.
            We want to enable cell-clicks, not row clicks. It is currently impossible to style entirety of specific table cells.
        */

       if (this.ref.current) 
       {
           let tableRows: HTMLCollectionOf<HTMLTableRowElement> = this.ref.current.getElementsByTagName("tr");

           //disable pointer cursor on rows
           for (let i = 0; i != tableRows.length; ++i) 
           {
               if (tableRows[i].style.cursor == "pointer") 
               {
                   tableRows[i].style.cursor = "inherit";
               }
           }

           let selectableCells: HTMLCollectionOf<Element> = this.ref.current.getElementsByClassName(TableCellHover.cellHoverClass);

           //any cell with the special cellHoveClass applied will have it's parent styled as hoverable
           for (let i = 0; i != selectableCells.length; ++i) 
           {
               selectableCells[i].parentElement.classList.add(sweepToBottom);
               selectableCells[i].parentElement.style.cursor = "pointer";
           }

       }
    }

    public componentDidMount(): void 
    {
        this.updateStyles();
    }

    public componentDidUpdate(): void 
    {
        this.updateStyles();
    }

    public render() : JSX.Element
    {
        return (
            <div ref={this.ref}>
                {this.props.children}
            </div>
        );
    }
}
