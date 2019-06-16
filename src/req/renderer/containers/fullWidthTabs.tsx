import * as React from "react";

import {SwipeableViews} from "../components/swipeableViews";
import {TabContainer} from "../components/tabContainer";
import { AppBar } from '../components/appBar';
import { Tabs } from '../components/tabs';
import { Tab } from '../components/tab';

export interface FullWidthTab
{
    label : string;
    body : JSX.Element
    className? : string;
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
                            <Tab className={el.className} label={el.label} />
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