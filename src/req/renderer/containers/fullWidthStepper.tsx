import * as React from "react";

import {SwipeableViews} from "../components/swipeableViews";
import { Stepper } from '../components/stepper';
import { Step } from '../components/step';
import { StepLabel } from '../components/stepLabel';
import { Button } from '../components/button';
import {Grid} from "../components/grid";
import {GridWrapper} from "../containers/gridWrapper";
import { Typography } from '../components/typography';

export interface FullWidthStep
{
    label : string;
    body : JSX.Element
    className? : string;
}

export interface FullWidthStepperForm
{
    onAdvance : (step : number) => Promise<boolean>;
    currentStep : number;
    state : {
        errors : Array<string>;
        validSteps : Array<boolean>;
    };
}

export interface FullWidthStepperProps
{
    steps : Array<FullWidthStep>;
    form : FullWidthStepperForm;
}

export function FullWidthStepper(props : FullWidthStepperProps) : JSX.Element
{
    props.form.currentStep = 0;

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
                                    <Grid item>
                                        {props.form.state.errors ? props.form.state.errors.map((err) => {
                                            return (
                                                <Typography>{err}</Typography>
                                            );
                                        }) : ""}
                                    </Grid>
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
                                                    if(value < props.steps.length - 1)
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
