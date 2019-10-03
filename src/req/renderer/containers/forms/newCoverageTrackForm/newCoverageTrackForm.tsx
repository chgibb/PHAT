import * as React from "react";

import {CircularFigure, Contig} from "../../../circularFigure/circularFigure";
import {AlignData} from "../../../../alignData";
import {Form, FullWidthStepperForm} from "../../fullWidthStepperForm";

import {step1} from "./step1";
import {step2} from "./step2";
import {step3} from "./step3";

export interface NewCoverageTrackFormProps
{
    figure : CircularFigure;
    contig : Contig;
    align : AlignData;
}

export interface NewCoverageTrackFormState
{
    log10Scale : boolean;
    scaleFactor : number;
    color : string;
    errors : Array<string>;
    currentStep : number;
}

export class NewCoverageTrackForm extends React.Component<NewCoverageTrackFormProps,NewCoverageTrackFormState> implements Form
{
    public constructor(props : NewCoverageTrackFormProps)
    {
        super(props);

        this.state = {
            log10Scale : false,
            scaleFactor : 1,
            errors : [],
            color : "#000000",
            currentStep : 0
        };

        this.setState = this.setState.bind(this);
    }

    step1 = step1.bind(this);
    step2 = step2.bind(this);
    step3 = step3.bind(this);

    public onAdvance(step : number) : Promise<boolean>
    {
        return new Promise<boolean>((resolve : (val : boolean) => void) : void => 
        {
            return resolve(true);
        });
    }

    public onRetreat(step : number) : Promise<boolean>
    {
        return new Promise<boolean>((resolve : (val : boolean) => void) : void => 
        {
            return resolve(true);
        });
    }

    public render() : JSX.Element
    {
        return (
            <div>
                <div>
                    <FullWidthStepperForm
                        form={this}
                        setFormState={this.setState}
                        steps={[
                            this.step1(),
                            this.step2(),
                            this.step3()
                        ]}
                        disableNavigation={false}
                    />
                </div>
            </div>
        );
    }
}
