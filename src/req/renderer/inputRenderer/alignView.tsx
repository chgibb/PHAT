import * as React from "react";

import { AlignData } from '../../alignData';
import { Button } from '../components/button';
import { inputAlignDialog } from './inputAlignDialog';
import { LinkMapTable } from '../containers/linkMapTable';
import { CompatibleRefTable } from '../containers/compatibleRefTable';
import { getLinkableRefSeqs } from '../../getLinkableRefSeqs';
import { Fasta } from '../../fasta';
import { getReferenceFromUuid } from '../../uniquelyAddressable';

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
                : this.state.tryingToLinkRef && this.state.mapToLinkUuid ?
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
                        linkableRefSeqs={
                            getLinkableRefSeqs(
                                this.props.fastaInputs.filter((x) => {
                                    return x.indexedForVisualization
                                }),getReferenceFromUuid(this.props.aligns,this.state.mapToLinkUuid)
                            )
                        }
                        mapToLinkUuid={this.state.mapToLinkUuid}
                    />
                </React.Fragment> : ""}
            </React.Fragment>
        )
    }
}

