import * as React from "react";

import { AlignData } from '../../alignData';
import { Button } from '../components/button';
import { inputAlignDialog } from './inputAlignDialog';
import { LinkMapTable } from '../containers/linkMapTable';
import { CompatibleRefTable } from '../containers/compatibleRefTable';
import { getLinkableRefSeqs, LinkableRefSeq } from '../../getLinkableRefSeqs';
import { Fasta } from '../../fasta';
import { getReferenceFromUuid } from '../../uniquelyAddressable';
import { IncompatibleRefTable } from '../containers/incompatibleRefTable';

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
                this.props.fastaInputs.filter((x) => {
                    return x.indexedForVisualization
                }),getReferenceFromUuid(this.props.aligns,this.state.mapToLinkUuid)
            );
        }

        return (
            <React.Fragment>
                {!this.state.tryingToLinkRef ?
                    <React.Fragment>
                        <Button
                            onClick={() => {
                                inputAlignDialog();
                            }}
                            label="Browse"
                        />
                        <LinkMapTable 
                            aligns={this.props.aligns}
                            fastaInputs={this.props.fastaInputs}
                            linkMapOnClick={(map : AlignData) => {
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
                        onClick={() => {
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
                        linkActionClick={()=>null}
                    />
                    <IncompatibleRefTable
                        fastaInputs={this.props.fastaInputs}
                        linkableRefSeqs={linkableRefSeqs}
                    />
                </React.Fragment> : ""}
            </React.Fragment>
        )
    }
}

