import * as React from "react";

import {AlignData} from "../../../../alignData";
import {Button} from "../../../components/button";
import {LinkMapTable} from "../../../containers/tables/linkMapTable";
import {CompatibleRefTable, CompatibleRefTableRow} from "../../../containers/tables/compatibleRefTable";
import {getLinkableRefSeqs, LinkableRefSeq} from "../../../../getLinkableRefSeqs";
import {Fasta} from "../../../../fasta";
import {getReferenceFromUuid} from "../../../../uniquelyAddressable";
import {IncompatibleRefTable} from "../../../containers/tables/incompatibleRefTable";
import {linkRefSeqToAlignment} from "../publish";

import {inputAlignDialog} from "./inputAlignDialog";

export interface AlignViewProps
{
    aligns : Array<AlignData>;
    fastaInputs : Array<Fasta>;
}

export interface AlignViewState
{
    tryingToLinkRef : boolean;
    mapToLinkUuid? : string;
}

export class AlignView extends React.Component<AlignViewProps,AlignViewState>
{
    public constructor(props : AlignViewProps)
    {
        super(props);

        this.state = {
            tryingToLinkRef : false,
            mapToLinkUuid : undefined
        } as AlignViewState;
    }

    public render()
    {
        let showingCompatibleTables = this.state.tryingToLinkRef && this.state.mapToLinkUuid;
        let linkableRefSeqs : Array<LinkableRefSeq> | undefined;
        if(showingCompatibleTables)
        {
            linkableRefSeqs = getLinkableRefSeqs(
                this.props.fastaInputs.filter((x) => 
                {
                    return x.indexedForVisualization;
                }),getReferenceFromUuid(this.props.aligns,this.state.mapToLinkUuid)
            );
        }

        return (
            <React.Fragment>
                {!this.state.tryingToLinkRef ?
                    <React.Fragment>
                        <Button
                            type="remain"
                            onClick={() => 
                            {
                                inputAlignDialog();
                            }}
                            label="Browse"
                        />
                        <LinkMapTable 
                            aligns={this.props.aligns}
                            fastaInputs={this.props.fastaInputs}
                            linkMapOnClick={(map : AlignData) => 
                            {
                                this.setState({
                                    tryingToLinkRef : true,
                                    mapToLinkUuid : map.uuid
                                });
                            }}
                        />
                    </React.Fragment>
                    : showingCompatibleTables ?
                        <React.Fragment>
                            <Button
                                type="retreat"
                                onClick={() => 
                                {
                                    this.setState({
                                        tryingToLinkRef : false,
                                        mapToLinkUuid : undefined
                                    });
                                }}
                                label="Go Back"
                            />
                            <CompatibleRefTable
                                fastaInputs={this.props.fastaInputs}
                                linkableRefSeqs={linkableRefSeqs}
                                linkActionClick={(row : CompatibleRefTableRow) => 
                                {
                                    linkRefSeqToAlignment(
                                        getReferenceFromUuid(this.props.fastaInputs,row.fasta.uuid),
                                        getReferenceFromUuid(this.props.aligns,this.state.mapToLinkUuid)
                                    );

                                    this.setState({
                                        tryingToLinkRef : false,
                                        mapToLinkUuid : undefined
                                    });
                                }}
                            />
                            <IncompatibleRefTable
                                fastaInputs={this.props.fastaInputs}
                                linkableRefSeqs={linkableRefSeqs}
                            />
                        </React.Fragment> : ""}
            </React.Fragment>
        );
    }
}

