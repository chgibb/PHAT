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

export function ToolBarTabs<T>(props : ToolBarTabsProps<T>) : JSX.Element
{
    const [activeTabIndex, setActiveTabIndex] = React.useState(0);

    const handleChangeIndex = (index : number) => 
    {
        setActiveTabIndex(index);
    };
    
    if(props.tabs && props.tabs.length != 0)
    {
        if(activeTabIndex > props.tabs.length - 1)
            setActiveTabIndex(props.tabs.length - 1);
        return (
            <div className={wrapperBGColour}>
                <AppBar position="static" color="default">
                    <GridWrapper>
                        <Grid container spacing={1} justify="flex-start">
                            {props.tabs.map((el,i) => 
                            {
                                return (
                                    <Grid item>
                                        <Chip 
                                            variant={activeTabIndex != i ? "outlined" : undefined}
                                            size="medium" 
                                            label={el.label}
                                            color="primary"
                                            onClick={()=>
                                            {
                                                handleChangeIndex(i);
                                            }}
                                            onDelete={() => 
                                            {
                                                props.onTabDelete(el,i);

                                                setTimeout(() => 
                                                {
                                                    (global as any).gc();
                                                },100);
                                            }}
                                            avatar={<Avatar src={viewImages[el.imgKey]()} />} 
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
                            index={activeTabIndex}
                            onChangeIndex={handleChangeIndex}
                        >
                            {props.tabs.map((el) => 
                            {
                                return (
                                    <TabContainer dir="rtl">{el.body(props.propPack)}</TabContainer>
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