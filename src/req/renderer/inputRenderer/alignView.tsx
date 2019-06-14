import * as React from "react";

import { AlignData } from '../../alignData';
import { Button } from '../components/button';
import { inputAlignDialog } from './inputAlignDialog';
import { LinkMapTable } from '../containers/linkMapTable';
import { CompatibleRefTable } from '../containers/compatibleRefTable';
import { getLinkableRefSeqs } from '../../getLinkableRefSeqs';
import { Fasta } from '../../fasta';

export interface AlignViewProps
{
    aligns : Array<AlignData>;
    fastaInputs : Array<Fasta>;
}

export interface AlignViewState
{
    tryingToLinkRef : boolean;
    mapToLink? : AlignData;
}

export class AlignView extends React.Component<AlignViewProps,AlignViewState>
{
    public constructor(props : AlignViewProps)
    {
        super(props);

        this.state = {
            tryingToLinkRef : false,
            mapToLink : undefined
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
                                    mapToLink : map
                                });
                            }}
                        />
                        </React.Fragment>
                : 
                <React.Fragment>
                    <CompatibleRefTable
                        linkableRefSeqs={getLinkableRefSeqs(this.props.fastaInputs,this.state.mapToLink)}
                        mapToLink={this.state.mapToLink}
                    />
                </React.Fragment>}
            </React.Fragment>
        )
    }
}

