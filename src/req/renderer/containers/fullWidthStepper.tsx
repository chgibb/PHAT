import * as React from "react";

import {SwipeableViews} from "../components/swipeableViews";

import { Stepper } from '../components/stepper';
import { Step } from '../components/step';
import { StepLabel } from '../components/stepLabel';
import { Button } from '../components/button';

export interface FormData<T>
{
    step : string;
    data : T;
}

export interface FormStepProps<T>
{
    setFormState : (data : T) => void;
}

export type FormStep = React.Component<FormStepProps<any>,{}>;

export interface FullWidthStep
{
    label : string;
    body : FormStep;
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

    const handleChangeIndex = async (index : number) => 
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
                            <div>
                                {el.body} 
                            </div>
                            <Button
                                label="Next"
                                onClick={()=>null}
                            />
                        </div>
                    );
                })}
            </SwipeableViews>
        </div>
    );
}
