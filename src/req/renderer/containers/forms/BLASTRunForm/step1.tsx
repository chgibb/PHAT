import * as React from "react";

import { BLASTRunForm } from '../BLASTRunForm';
import { FullWidthFormStep } from '../../fullWidthStepperForm';

export function step1(form : BLASTRunForm) : FullWidthFormStep
{
    let label = "Select Range to BLAST";

    if(form.validateSelectedRange())
    {
        label = `Search From ${form.state.start} to ${form.state.stop}`;
    }

    return {
        label : label,
        body : (<div>
            <input type="text" onChange={form.onStepOneStartChange}></input>
            <input type="text" onChange={form.onStepOneEndChange}></input>
        </div>)
    };
}
