import * as React from "react";

import { BLASTRunForm } from '../BLASTRunForm';
import { FullWidthFormStep } from '../../fullWidthStepperForm';

export function step2(form : BLASTRunForm) : FullWidthFormStep
{
    let label = "Identify Reads and Fragments to BLAST";

    return {
        label : label,
        body : (
            <div>
                
            </div>
        )
    };
}