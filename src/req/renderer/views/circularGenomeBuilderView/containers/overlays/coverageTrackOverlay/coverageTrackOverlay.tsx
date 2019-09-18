import * as React from "react";

import {CircularFigure} from "../../../../../circularFigure/circularFigure";
import {Fasta} from "../../../../../../fasta";
import {AlignData} from "../../../../../../alignData";
import {AlignmentsReportTable} from "../../../../../containers/tables/alignmentsReportTable";
import {getReferenceFromUuid} from "../../../../../../uniquelyAddressable";

import {Overlay} from "./../overlay";
import {AlignmentCoverageTrackOverlay} from "./alignmentCoverageTracksOverlay";

export interface CoverageTrackOverlayProps
{
    onClose: () => void;
    onSave: () => void;
    open : boolean;
    figure : CircularFigure;
    fastas : Array<Fasta>;
    aligns : Array<AlignData>;
}

export interface CoverageTrackOverlayState
{
    selectedAlignUuid : string;
}

export class CoverageTrackOverlay extends React.Component<CoverageTrackOverlayProps,CoverageTrackOverlayState>
{
    public constructor(props : CoverageTrackOverlayProps)
    {
        super(props);

        this.state = {
            selectedAlignUuid : ""
        };
    }

    public render() : JSX.Element
    {
        let selectedAlign = getReferenceFromUuid(this.props.aligns,this.state.selectedAlignUuid);

        return (
            <Overlay
                kind="drawerTop"
                restrictions={["noDrawerLeft","noDrawerRight"]}
                open={this.props.open}
                onClose={this.props.onClose}
            >
                {
                    selectedAlign ? 
                        <AlignmentCoverageTrackOverlay
                            onClose={() => 
                            {
                                this.setState({
                                    selectedAlignUuid : ""
                                });
                            }}
                            align={selectedAlign}
                            figure={this.props.figure}
                        /> :
                        <AlignmentsReportTable
                            viewMore={(rowData) => 
                            {
                                this.setState({
                                    selectedAlignUuid : rowData.uuid
                                });
                            }}
                            title="Select Alignment to View Coverage Tracks For"
                            clickableCells={false}
                            toolTipText="View Coverage Tracks For This Alignment"
                            aligns={this.props.aligns.filter((x) => 
                            {
                                if(x.fasta)
                                {
                                    if(x.fasta.uuid == this.props.figure.uuidFasta)
                                    {
                                        return x;
                                    }
                                }
                                return undefined;
                            })}
                            fastas={this.props.fastas}
                            onRowClick={() => null}
                        />
                }
            </Overlay>
        );
    }
}