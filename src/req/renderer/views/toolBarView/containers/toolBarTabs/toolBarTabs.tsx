import * as React from "react";
import * as electron from "electron";

import {TabContainer} from "../../../../components/tabContainer";
import {AppBar} from "../../../../components/appBar";
import {GridWrapper} from "../../../../containers/gridWrapper";
import {Grid} from "../../../../components/grid";
import {Chip} from "../../../../components/chip";
import {Avatar} from "../../../../components/avatar";
import {tabInfo} from "../../tabInfo";
import {AtomicOperationIPC} from "../../../../../atomicOperationsIPC";
import {Tabs} from "../../../../components/tabs";

import {wrapperBGColour} from "./styles/wrapperBGColour";

const ipc = electron.ipcRenderer;

export interface ToolBarTab<T>
{
    label : string;
    refKey : keyof typeof tabInfo;
    body : (props : T) => JSX.Element
    className? : string;
}

export interface ToolBarTabsProps<T>
{
    tabs : Array<ToolBarTab<T>>;
    onTabDelete : (tab : ToolBarTab<T>,i : number) => void;
    propPack : T;
}

export interface ToolBarTabsState
{
    activeTabIndex : number;
}

function unDockActiveTab(refName : string) : void
{
    ipc.send(
        "runOperation",
        {
            opName : "unDockWindow",
            refName : refName
        } as AtomicOperationIPC
    );
}

export class ToolBarTabs<T> extends React.Component<ToolBarTabsProps<T>,ToolBarTabsState>
{
    public state : ToolBarTabsState;
    public constructor(props : ToolBarTabsProps<T>)
    {
        super(props);

        this.state = {
            activeTabIndex : 0
        } as ToolBarTabsState;

    }

    public setActiveTabIndex(index : number) : void
    {
        this.setState({
            activeTabIndex : index
        });
    }
    
    public render() : JSX.Element
    {
        if(this.props.tabs && this.props.tabs.length != 0)
        {
            if(this.state.activeTabIndex > this.props.tabs.length - 1)
                this.setActiveTabIndex(this.props.tabs.length - 1);
            return (
                <div className={wrapperBGColour}>
                    <AppBar position="static" color="default">
                        <GridWrapper>
                            <Grid container spacing={1} justify="flex-start">
                                {this.props.tabs.map((el,i) => 
                                {
                                    return (
                                        <Grid item>
                                            <Chip 
                                                variant={this.state.activeTabIndex != i ? "outlined" : undefined}
                                                size="medium" 
                                                label={el.label}
                                                color="primary"
                                                onClick={()=>
                                                {
                                                    this.setActiveTabIndex(i);
                                                }}
                                                onDelete={() => 
                                                {
                                                    this.props.onTabDelete(el,i);
                                                }}
                                                avatar={
                                                    <Avatar imgProps={
                                                        {
                                                            onDragEnd : () => 
                                                            {
                                                                console.log(`stopped drgging ${i}`);
                                                                let clientBounds = electron.remote.getCurrentWindow().getBounds();
                                                                let cursorPos = electron.screen.getCursorScreenPoint();

                                                                let shouldUndock = false;
                                                                if(cursorPos.x < clientBounds.x)
                                                                    shouldUndock = true;
                                                                else if(cursorPos.y < clientBounds.y)
                                                                    shouldUndock = true;
                                                                else if(cursorPos.x > clientBounds.x + clientBounds.width)
                                                                    shouldUndock = true;
                                                                else if(cursorPos.y > clientBounds.y + clientBounds.height)
                                                                    shouldUndock = true;
                                                                
                                                                if(shouldUndock)
                                                                {
                                                                    unDockActiveTab(tabInfo[el.refKey].refName);
                                                                    this.props.onTabDelete(el,i);
                                                                }
                                                            }
                                                        }
                                                    } src={tabInfo[el.refKey].imgURI()} />} 
                                            />
                                        </Grid>
                                    );
                                })}
                                
                            </Grid>
                        </GridWrapper>
                    </AppBar>
                    {this.props.tabs.map((el,i) => 
                    {
                        return (
                            <div style={{
                                visibility : this.state.activeTabIndex == i ? "visible" : "hidden",
                                height : this.state.activeTabIndex == i ? "inherit" : "0px"
                            }}>
                                <TabContainer dir="rtl">{el.body(this.props.propPack)}</TabContainer>
                            </div>
                        );
                    })}
                </div>
            );
        }
        return null;
    }
}
