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


export interface ToolBarTab
{
    label : string;
    imgKey : keyof typeof viewImages;
    body : JSX.Element
    className? : string;
}

export interface ToolBarTabsProps
{
    tabs : Array<ToolBarTab>;
    onTabDelete : (tab : ToolBarTab,i : number) => void;
}

export function ToolBarTabs({tabs,onTabDelete} : ToolBarTabsProps) : JSX.Element
{
    const [activeTabIndex, setActiveTabIndex] = React.useState(0);

    const handleChangeIndex = (index : number) => 
    {
        setActiveTabIndex(index);
    };
    
    if(tabs && tabs.length != 0)
    {
        if(activeTabIndex > tabs.length - 1)
            setActiveTabIndex(tabs.length - 1);
        return (
            <div className={wrapperBGColour}>
                <AppBar position="static" color="default">
                    <GridWrapper>
                        <Grid container spacing={1} justify="flex-start">
                            {tabs.map((el,i) => 
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
                                                onTabDelete(el,i);
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
                            {tabs.map((el) => 
                            {
                                return (
                                    <TabContainer dir="rtl">{el.body}</TabContainer>
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