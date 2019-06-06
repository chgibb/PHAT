import * as React from "react";

import {SwipeableViews} from "./swipeableViews";
import {TabContainer} from "./tabContainer";
import { AppBar } from './appBar';
import { Tabs } from './tabs';
import { Tab } from './tab';

export interface FullWidthTab
{
    label : string;
    body : JSX.Element
}

export interface FullWidthTabsProps
{
    tabs : Array<FullWidthTab>;
}

export function FullWidthTabs({tabs} : FullWidthTabsProps) : JSX.Element
{
    const [value, setValue] = React.useState(0);

    const handleChange = (event : React.ChangeEvent<{}>,newValue : number) => {
        setValue(newValue);
    }

    const handleChangeIndex = (index : number) => {
        setValue(index);
    }

    return (
        <div>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    {tabs.map((el) => {
                        return (
                            <Tab label={el.label} />
                        )
                    })}
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis="x"
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                {tabs.map((el) => {
                    return (
                        <TabContainer dir="rtl">{el.body}</TabContainer>
                    )
                })}
            </SwipeableViews>
        </div>
    );
}