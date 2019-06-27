import * as React from "react";

import {Fasta} from "../../fasta";
import {AlignData} from "../../alignData";
import {Fastq} from "../../fastq";

export interface OutputRendererAppState
{
    fastqs? : Array<Fastq>;
    fastas? : Array<Fasta>;
    aligns? : Array<AlignData>;
}

export class OutputRendererApp extends React.Component<{},{}>
{
    public constructor()
    {
        super({});
    }

    public render() : JSX.Element
    {
        return (
            <div></div>
        );
    }
}
