import * as React from "react";

import {SwipeableViews} from "../components/swipeableViews";

import { Stepper } from '../components/stepper';
import { Step } from '../components/step';
import { StepLabel } from '../components/stepLabel';

export interface FullWidthStep
{
    label : string;
    body : JSX.Element
    className? : string;
}

export interface FullWidthStepperProps
{
    steps : Array<FullWidthStep>;
}

export function FullWidthStepper(props : FullWidthStepperProps) : JSX.Element
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

    return (
        <div>
            <Stepper activeStep={value} alternativeLabel>
                {props.steps.map((step) => {
                    return (
                        <Step key={step.label}>
                            <StepLabel>{step.label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <SwipeableViews
                axis="x"
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                {props.steps.map((el) => 
                {
                    return (
                        <div>
                            {el.body}
                        </div>
                    );
                })}
            </SwipeableViews>
        </div>
    );
}
