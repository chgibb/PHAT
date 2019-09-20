import * as React from "react";

import { NewCoverageTrackForm } from './newCoverageTrackForm';
import { FullWidthFormStep } from '../../fullWidthStepperForm';

export function step2(this : NewCoverageTrackForm) : FullWidthFormStep
{
    return {
        label : "",
        body : (
            <div>
            </div>
        )
    };
}