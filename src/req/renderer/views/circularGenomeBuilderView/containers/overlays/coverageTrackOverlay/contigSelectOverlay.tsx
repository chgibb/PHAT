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
import {AddBox} from "../../../../../components/icons/addBox";
import {TreeItem} from "../../../../../components/treeItem";

export interface ContigSelectProps {
    onClose: () => void;
    align: AlignData;
    figure: CircularFigure;
}

export interface ContigSelectState {

}

export class ContigSelectOverlay extends React.Component<ContigSelectProps, ContigSelectState>
{
    public constructor(props: ContigSelectProps) 
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
                                    {
                                        this.props.figure.contigs.map((contig,i) => 
                                        {
                                            return (
                                                <TreeItem
                                                    nodeId={`${contig.name}-${i}`}
                                                    label={contig.name}
                                                >
                                                    {
                                                        this.props.figure.renderedCoverageTracks.map((track,j) => 
                                                        {
                                                            return (
                                                                <TreeItem
                                                                    nodeId={`${contig.name}-${i}-${j}`}
                                                                    label={`Scaled by ${track.scaleFactor}${track.log10Scaled ? ", log10 scaled" : ""}`}
                                                                />
                                                            );
                                                        })
                                                    }
                                                    <TreeItem
                                                        nodeId={`${contig.name}-${i}-new`}
                                                        label="New Coverage Track"
                                                        icon={
                                                            <React.Fragment>
                                                                <AddBox 
                                                                    color="primary" 
                                                                    classes={{colorPrimary:blue}} 
                                                                />
                                                                <AddBox 
                                                                    color="primary" 
                                                                    classes={{colorPrimary:blue}} 
                                                                />
                                                            </React.Fragment>
                                                        }
                                                    />
                                                </TreeItem>
                                            );
                                        })
                                    }
                                </TreeView>
                            </Grid>
                        </Grid>
                    </div>
                </GridWrapper>
            </React.Fragment>
        );
    }
}