import * as React from "react";
import { Form, FullWidthStepperForm, FullWidthFormStep } from '../fullWidthStepperForm';
import { step1 } from './BLASTRunForm/step1';
import { step2 } from './BLASTRunForm/step2';
import { AlignData } from '../../../alignData';
import { ReadWithFragments } from '../../../readWithFragments';

export interface BLASTRunFormProps
{
    align? : AlignData;
}

export interface BLASTRunFormState
{
    start? : number;
    stop? : number;
    readsWithFragments? : Array<ReadWithFragments> | undefined;
    searchForReadsWithFragments? : Promise<void> | undefined;
    errors : Array<string>;
    currentStep : number;
}

export class BLASTRunForm extends React.Component<BLASTRunFormProps,BLASTRunFormState> implements Form
{
    public state : BLASTRunFormState;
    public constructor(props : BLASTRunFormProps)
    {
        super(props);

        this.state = {
            errors : [],
            currentStep : 0
        };

        this.validateSelectedRange = this.validateSelectedRange.bind(this);
        this.onStepOneStartChange = this.onStepOneStartChange.bind(this);
        this.onStepOneEndChange = this.onStepOneEndChange.bind(this);

        this.setState = this.setState.bind(this);
    }

    public onAdvance(step : number) : Promise<boolean>
    {
        return new Promise<boolean>((resolve : (val : boolean) => void) : void => {
            if(step == 0)
            {
                if(!this.validateSelectedRange())
                {
                    this.setState({
                        errors : ["Start must be before end"]
                    });
                    return resolve(false);
                }
            }

            this.setState({
                errors:[]
            })
            return resolve(true);
        })
    }

    public onRetreat(step :  number) : Promise<boolean>
    {
        return new Promise<boolean>((resolve : (val : boolean) => void) : void => {
            return resolve(true);
        });
    }

    public validateSelectedRange() : boolean
    {
        if(this.state.start === undefined)
            return false;
        if(this.state.stop === undefined)
            return false;
        
        if(isNaN(this.state.start))
            return false;
        
        if(isNaN(this.state.stop))
            return false;

        if(this.state.stop <= this.state.start)
            return false;
        
        if(this.state.start < 0 || this.state.stop < 0)
            return false;

        return true;
    }

    public onStepOneStartChange(event : React.ChangeEvent<HTMLInputElement>) : void
    {
        this.setState({
            start : parseInt(event.target.value)
        })
    }

    public onStepOneEndChange(event : React.ChangeEvent<HTMLInputElement>) : void
    {
        this.setState({
            stop : parseInt(event.target.value)
        })
    }

    public render() : JSX.Element | null
    {
        if(!this.props.align)
            return null;

        let steps : Array<FullWidthFormStep> = new Array();

        steps.push(step1(this));
        steps.push(step2(this));

        return (
            <div>
                <div>
                    <FullWidthStepperForm
                        form={this}
                        setFormState={this.setState}
                        steps={steps}
                        disableNavigation={this.state.currentStep == 1 && this.state.searchForReadsWithFragments ? this.state.searchForReadsWithFragments}
                    />
                </div>
            </div>
        )
    }
}