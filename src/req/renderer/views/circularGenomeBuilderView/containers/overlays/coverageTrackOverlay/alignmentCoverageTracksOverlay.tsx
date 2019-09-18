import * as React from "react";

import {Grid} from "../../../../../components/grid";
import {IconButton} from "../../../../../components/iconButton";
import {blue} from "../../../../../styles/colours";
import {ChevronLeft} from "../../../../../components/icons/chevronLeft";
import {AlignData} from "../../../../../../alignData";
import {CircularFigure} from "../../../../../circularFigure/circularFigure";
import {GridWrapper} from "../../../../../containers/gridWrapper";
import {TreeView} from "../../../../../components/treeView";
import {ExpandMore} from "../../../../../components/icons/expandMore";
import {ChevronRight} from "../../../../../components/icons/chevronRight";
import {ContigTree} from "../../../../../containers/contigTree";

export interface AlignmentCoverageTracksOverlayProps {
    onClose: () => void;
    align: AlignData;
    figure: CircularFigure;
}

export interface AlignmentCoverageTrackOverlayState {

}

export class AlignmentCoverageTrackOverlay extends React.Component<AlignmentCoverageTracksOverlayProps, AlignmentCoverageTrackOverlayState>
{
    public constructor(props: AlignmentCoverageTracksOverlayProps) 
    {
        super(props);

        this.state = {

        };
    }

    public render(): JSX.Element 
    {
        return (
            <React.Fragment>
                <div style={{marginLeft: "2vh"}}>
                    <Grid container spacing={4} justify="flex-start">
                        <IconButton
                            edge="start"
                            color="primary"
                            classes={{colorPrimary: blue}}
                            onClick={this.props.onClose}
                        >
                            <ChevronLeft />
                        </IconButton>
                    </Grid>
                </div>
                <GridWrapper>
                    <div style={{marginLeft: "1vh", marginBottom: "1vh"}}>
                        <Grid container direction="row" spacing={1} justify="flex-start">
                            <Grid item>
                                <TreeView
                                    defaultExpandIcon={<ChevronRight color="primary" classes={{colorPrimary: blue}} />}
                                    defaultCollapseIcon={<ExpandMore color="primary" classes={{colorPrimary: blue}} />}
                                >
                                    <ContigTree
                                        label="Select Contig to View Coverage Tracks For"
                                        contigs={this.props.figure.contigs}
                                        onClick={(contig) => 
                                        {
                                            this.setState({
                                                selectedContigUuid: contig.uuid
                                            });
                                        }}
                                    />
                                </TreeView>
                            </Grid>
                        </Grid>
                    </div>
                </GridWrapper>
            </React.Fragment>
        );
    }
}