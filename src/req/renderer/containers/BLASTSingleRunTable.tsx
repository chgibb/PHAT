import * as React from "react";

import {AlignData} from "../../alignData";
import {BLASTReadResult, BLASTFragmentResult, getBLASTReadResults, BLASTSegmentResult, getBLASTFragmentResults} from "../../BLASTSegmentResult";
import {Table, SubTableProps} from "../components/table";
import { activeHover } from '../styles/activeHover';
import { BLASTSingleRunSequenceStyle } from '../styles/BLASTSingleRunSequence';

export interface BLASTSingleRunTableProps
{
    align : AlignData;
    BLASTuuid : string;
    subTableProps? : SubTableProps;
}

export interface BLASTSingleRunTableState
{
    readResults? : Array<BLASTReadResult>;
    fragmentResults? : Array<BLASTFragmentResult>;
}

interface BLASTSingleRunTableLayout
{
    position : number;
    sequence : JSX.Element;
    hitDef : string;
    eValue : string;
}

export class BLASTSingleRunTable extends React.Component<BLASTSingleRunTableProps,BLASTSingleRunTableState>
{
    public state : BLASTSingleRunTableState;
    public constructor(props : BLASTSingleRunTableProps)
    {
        super(props);
        this.state = {

        } as BLASTSingleRunTableState;
    }

    public async loadReads(handle : BLASTSegmentResult) : Promise<void>
    {
        let reads = await getBLASTReadResults(handle);
        this.setState({
            readResults : reads
        });
    } 

    public async loadFragments(handle : BLASTSegmentResult) : Promise<void>
    {
        let fragments = await getBLASTFragmentResults(handle);
        this.setState({
            fragmentResults : fragments
        });
    }

    public render() : JSX.Element
    {
        let resultsHandle : BLASTSegmentResult = this.props.align.BLASTSegmentResults.find(x => x.uuid == this.props.BLASTuuid);
        
        if(!this.state.readResults && this.props.align)
        {
            this.loadReads(resultsHandle);
            return null;
        }

        if(!this.state.fragmentResults && this.props.align)
        {
            this.loadFragments(resultsHandle);
            return null;
        }

        let positions : Array<number> = new Array();
        let sequences : Array<JSX.Element> = new Array();
        let tableData : Array<BLASTSingleRunTableLayout> = new Array();

        if(this.state.readResults && this.state.fragmentResults)
        {
            for(let i = 0; i != this.state.readResults.length; ++i)
            {
                positions.push(this.state.readResults[i].readWithFragments.read.POS);

                sequences.push((
                    <React.Fragment>
                        {this.state.readResults[i].readWithFragments.fragments.map((fragment) => 
                        {
                            if(fragment.type == "mapped" || fragment.type == "remainder")
                            {
                                return (
                                    <span>
                                        {fragment.seq}
                                    </span>);
                            }

                            else if(fragment.type == "unmapped")
                            {
                                let hoverText = "";
                                for(let k = 0; k != this.state.fragmentResults.length; ++k)
                                {
                                    if(this.state.fragmentResults[k].readuuid == this.state.readResults[i].uuid)
                                    {
                                        if(this.state.fragmentResults[k].results.noHits)
                                        {
                                            hoverText = "No Hits";
                                        }

                                        else 
                                        {
                                            hoverText = this.state.fragmentResults[k]
                                                .results
                                                .BlastOutput
                                                .BlastOutput_iterations[0]
                                                .Iteration[0]
                                                .Iteration_hits[0]
                                                .Hit[0]
                                                .Hit_def[0];
                                            break;
                                        }
                                    }
                                }
                                return (
                                    <span
                                        className={`${BLASTSingleRunSequenceStyle} ${activeHover}`}
                                        title={hoverText}
                                    >
                                        {fragment.seq}
                                    </span>
                                );
                            }
                            return null;
                            
                        })}
                    </React.Fragment>
                ));
            }
        }


        for(let i = 0; i != positions.length; ++i)
        {
            tableData.push({
                position : positions[i],
                sequence : sequences[i],
                hitDef : "",
                eValue : ""
            });
        }

        return (
            <Table<BLASTSingleRunTableLayout>
                title=""
                subTableProps={this.props.subTableProps}
                data={tableData}
                columns={[
                    {
                        title : "Position",
                        hidden : false,
                        searchable : true,
                        field : "position",
                        render : (row : BLASTSingleRunTableLayout) => 
                        {
                            return row.position;
                        }
                    },
                    {
                        title : "Sequence",
                        hidden : false,
                        searchable : true,
                        field : "sequence",
                        render : (row : BLASTSingleRunTableLayout) => 
                        {
                            return row.sequence;
                        }
                    }
                ]}
            />
        );
    }
}
