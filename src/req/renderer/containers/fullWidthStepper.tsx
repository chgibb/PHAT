import * as React from "react";

import {SwipeableViews} from "../components/swipeableViews";
import { Stepper } from '../components/stepper';
import { Step } from '../components/step';
import { StepLabel } from '../components/stepLabel';
import { Button } from '../components/button';
import {Grid} from "../components/grid";
import {GridWrapper} from "../containers/gridWrapper";

export interface FullWidthStep
{
    label : string;
    body : JSX.Element
    className? : string;
    errors? : Array<string>;
}

export interface FullWidthStepperForm
{
    onAdvance : (step : number) => Promise<boolean>;
}

export interface FullWidthStepperProps
{
    steps : Array<FullWidthStep>;
    form : FullWidthStepperForm;
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
                            <div>
                                {el.body}
                            </div>
                            <GridWrapper>
                                <Grid container spacing={4} justify="flex-end">
                                    <Grid item />
                                    <Grid item>
                                        <Button
                                            label="Previous"
                                            onClick={() => {
                                                if(value > 0)
                                                    handleChangeIndex(value - 1);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            label="Next"
                                            onClick={async () => {
                                                if(await props.form.onAdvance(value))
                                                {
                                                    handleChangeIndex(value + 1);
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item />
                                </Grid>
                            </GridWrapper>  
                        </div>
                    );
                })}
            </SwipeableViews>
        </div>
    );
}
