import * as React from "react";

import {getReadableAndWritable} from "../../../../../getAppPath";

import {GWFCard} from "./components/gwfCard";

export class GuidedWorkflowGallery extends React.Component<{}, {}>
{
    public constructor(props: {}) 
    {
        super(props);
    }

    public render(): JSX.Element 
    {
        return (
            <GWFCard title={"Input a Fastq File, View a QC Report"} imagePath={getReadableAndWritable("img/gwf/1.png")} />
        );
    }
}
