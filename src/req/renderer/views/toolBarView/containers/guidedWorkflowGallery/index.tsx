import * as React from "react";

import {getReadableAndWritable} from "../../../../../getAppPath";
import {GridWrapper} from "../../../../containers/gridWrapper";
import {Grid} from "../../../../components/grid";
import {activeHover} from "../../../../styles/activeHover";

import {tabInfo} from "./../../tabInfo";
import { Typography } from '../../../../components/typography';

export class GuidedWorkflowGallery extends React.Component<{}, {}>
{
    public constructor(props: {}) 
    {
        super(props);
    }

    public render(): JSX.Element 
    {
        return (
            <div style={{width:"72vh"}}>
                <div style={{marginLeft: "2vh"}} className={activeHover}>
                    <GridWrapper>
                        <Grid container spacing={1} justify="flex-start">
                            <Grid item>
                                <img src={tabInfo["Input"].imgURI()} />
                            </Grid>
                            <Grid item>
                                <img src={tabInfo["QC"].imgURI()} />
                            </Grid>
                            <Grid item>
                                <Typography>Input a Fastq File, View a QC Report</Typography>
                            </Grid>
                        </Grid>
                    </GridWrapper>
                    <img
                        style={{width:"70vh",height:"50vh"}} 
                        src={`${getReadableAndWritable("img/gwf/1.png")}`} />
                </div>
            </div>
        );
    }
}
