import * as React from "react";

import {SwipeableViews} from "../../../../components/swipeableViews";
import {TabContainer} from "../../../../components/tabContainer";
import {AppBar} from "../../../../components/appBar";
import {GridWrapper} from "../../../../containers/gridWrapper";
import {Grid} from "../../../../components/grid";
import {Chip} from "../../../../components/chip";
import {Avatar} from "../../../../components/avatar";

import {wrapperBGColour} from "./styles/wrapperBGColour";
import {outerSwipeableWrapper} from "./styles/outerSwipeableWrapper";
import {innerSwipeableWrapper} from "./styles/innerSwipeableWrapper";
import {viewImages} from "./../../viewImages";


export interface ToolBarTab<T>
{
    label : string;
    imgKey : keyof typeof viewImages;
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

                                                    setTimeout(() => 
                                                    {
                                                        (global as any).gc();
                                                    },100);
                                                }}
                                                avatar={
                                                    <Avatar imgProps={
                                                        {
                                                            onDragEnd : (event : React.DragEvent<HTMLImageElement>) => {
                                                                console.log(`stopped drgging ${i}`);
                                                            }
                                                        }
                                                    } src={viewImages[el.imgKey]()} />} 
                                            />
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </GridWrapper>
                    </AppBar>
                    <div className={outerSwipeableWrapper}>
                        <div className={innerSwipeableWrapper}>
                            <SwipeableViews
                                axis="x"
                                index={this.state.activeTabIndex}
                                onChangeIndex={this.setActiveTabIndex}
                            >
                                {this.props.tabs.map((el) => 
                                {
                                    return (
                                        <TabContainer dir="rtl">{el.body(this.props.propPack)}</TabContainer>
                                    );
                                })}
                            </SwipeableViews>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}
