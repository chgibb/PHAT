import * as React from "react";

import {SwipeableViews} from "../components/swipeableViews";
import {TabContainer} from "../components/tabContainer";
import {AppBar} from "../components/appBar";
import {Tabs} from "../components/tabs";

export interface ToolBarTab
{
    label : string;
    body : JSX.Element
    className? : string;
}

export interface ToolBarTabsProps
{
    tabs : Array<ToolBarTab>;
    tabComponent : (el : ToolBarTab) => JSX.Element;
}

export function ToolBarTabs({tabs,tabComponent} : ToolBarTabsProps) : JSX.Element
{
    const [value, setValue] = React.useState(0);

    const handleChange = (event : React.ChangeEvent<{}>,newValue : number) => 
    {
        setValue(newValue);
    };

    const handleChangeIndex = (index : number) => 
    {
        setValue(index);
    };
    
    if(tabs && tabs.length != 0)
    {
        return (
            <div style={{backgroundColor:"white"}}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        {tabs.map((el) => 
                        {
                            return tabComponent(el);
                        })}
                    </Tabs>
                </AppBar>
                <div className="FullWidthTabsWrapperWrapper" style={{backgroundColor:"white",paddingBottom:".5vh"}}>
                        <div className="FullWidthTabsWrapper" style={{margin:"1vh"}}>
                <SwipeableViews
                    axis="x"
                    index={value}
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