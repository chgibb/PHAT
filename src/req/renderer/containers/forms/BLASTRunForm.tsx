import * as React from "react";

import {Form, FullWidthStepperForm, FullWidthFormStep} from "../fullWidthStepperForm";
import {AlignData, getSam} from "../../../alignData";
import {ReadWithFragments} from "../../../readWithFragments";
import {getReadWithFragments} from "../../../getReadWithFragments";

import {step2} from "./BLASTRunForm/step2";
import {step1} from "./BLASTRunForm/step1";
import { enQueueOperation } from '../../enQueueOperation';

export interface BLASTRunFormProps
{
    align? : AlignData;
    shouldAllowTriggeringOps : boolean;
}

export interface BLASTRunFormState
{
    start? : number;
    stop? : number;
    readsWithFragments? : Array<ReadWithFragments> | undefined;
    readsScanned? : number;
    searchForReadsWithFragmentsPromise? : Promise<void> | undefined;
    searchingForReadsWithFragments : boolean;
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
            currentStep : 0,
            searchingForReadsWithFragments : false
        };

        this.validateSelectedRange = this.validateSelectedRange.bind(this);
        this.onStepOneStartChange = this.onStepOneStartChange.bind(this);
        this.onStepOneEndChange = this.onStepOneEndChange.bind(this);
        this.onStepTwoStartBLASTingOnClick = this.onStepTwoStartBLASTingOnClick.bind(this);

        this.setState = this.setState.bind(this);
    }

    private searchForReadsWithFragments() : Promise<void>
    {
        return new Promise<void>(async () => 
        {
            if(!this.props.align || this.state.start === undefined || this.state.stop === undefined)
            {
                this.setState({
                    searchingForReadsWithFragments : false,
                });
                return resolve();
            }
            let readsWithFragments = await getReadWithFragments(
                getSam(this.props.align),
                this.state.start,
                this.state.stop,
                (readsScanned : number) => 
                {
                    this.setState({
                        readsScanned : readsScanned
                    });
                }
            );

            this.setState({
                searchingForReadsWithFragments : false,
                readsWithFragments : readsWithFragments
            });
        });
    }

    public onAdvance(step : number) : Promise<boolean>
    {
        return new Promise<boolean>((resolve : (val : boolean) => void) : void => 
        {
            if(step == 0)
            {
                if(!this.validateSelectedRange())
                {
                    this.setState({
                        errors : ["Start must be before end"]
                    });
                    return resolve(false);
                }
                
                this.setState({
                    searchingForReadsWithFragments : true,
                    searchForReadsWithFragmentsPromise : this.searchForReadsWithFragments()
                });
            }

            this.setState({
                errors:[]
            });
            return resolve(true);
        });
    }

    public onRetreat(step :  number) : Promise<boolean>
    {
        return new Promise<boolean>((resolve : (val : boolean) => void) : void => 
        {
            if(step == 1)
            {
                this.setState({
                    searchingForReadsWithFragments : false,
                    searchForReadsWithFragmentsPromise : undefined,
                    readsWithFragments : undefined
                });
            }
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
        });
    }

    public onStepOneEndChange(event : React.ChangeEvent<HTMLInputElement>) : void
    {
        this.setState({
            stop : parseInt(event.target.value)
        });
    }

    public onStepTwoStartBLASTingOnClick() : void
    {
        enQueueOperation({
            opName : "BLASTSegment",
            align : this.props.align!,
            start : this.state.start!,
            stop : this.state.stop!
        });
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
                        disableNavigation={this.state.currentStep == 1 && this.state.searchingForReadsWithFragments}
                    />
                </div>
            </div>
        );
    }
}