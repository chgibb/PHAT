import * as React from "react";

import {TreeView} from "../../../../components/treeView";
import {TreeItem} from "../../../../components/treeItem";
import {CircularGenomeBuilderView} from "../../circularGenomeBuilderView";
import {GridWrapper} from "../../../../containers/gridWrapper";
import {Grid} from "../../../../components/grid";
import {Typography} from "../../../../components/typography";
import {ChevronRight} from "../../../../components/icons/chevronRight";
import {blue} from "../../../../styles/colours";
import {ExpandMore} from "../../../../components/icons/expandMore";
import {AddBox} from "../../../../components/icons/addBox";

import {Overlay} from "./overlay";

export interface FigureSelectOverlayProps {
    builder: CircularGenomeBuilderView;
    onClose : () => void;
    open : boolean;
}

export function FigureSelectOverlay(props: FigureSelectOverlayProps): JSX.Element 
{
    return (
        <Overlay
            kind="drawerLeft"
            restrictions={[]}
            onClose={props.onClose}
            open={props.open}
        >
            <div>
                <GridWrapper>
                    <div style={{marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh"}}>
                        <Grid container spacing={4} justify="center">
                            <Grid item>
                                <Typography variant="h5">Open a Figure</Typography>
                            </Grid>
                        </Grid>
                    </div>
                </GridWrapper>
                <GridWrapper>
                    <div style={{marginLeft: "1vh", marginBottom: "1vh"}}>
                        <Grid container direction="row" spacing={1} justify="center">
                            <Grid item>
                                <TreeView
                                    defaultExpandIcon={<ChevronRight color="primary" classes={{colorPrimary:blue}} />}
                                    defaultCollapseIcon={<ExpandMore color="primary" classes={{colorPrimary:blue}} />}
                                >
                                    {
                                        props.builder.props.fastas.map((fasta,fastaIndex) => 
                                        {
                                            return (                                             
                                                <TreeItem nodeId={`${fastaIndex}`} label={fasta.alias} id={`${fasta.uuid}ExpandTree`}>
                                                    {
                                                        props.builder.props.figures.map((figure,figureIndex) => 
                                                        {
                                                            if (fasta.uuid == figure.uuidFasta) 
                                                            {
                                                                return (
                                                                    <TreeItem 
                                                                        nodeId={`${fastaIndex}-${figureIndex}`} 
                                                                        label={figure.name}
                                                                        onClick={()=>
                                                                        {
                                                                            props.builder.setState({
                                                                                selectedFigure : figure.uuid,
                                                                                figureSelectOvelayOpen : false
                                                                            });
                                                                        }} 
                                                                    />
                                                                );
                                                            }
                                                            return (<TreeItem nodeId="" label="" />);
                                                        })
                                                    }
                                                    <TreeItem 
                                                        id={`${fasta.uuid}NewFigure`}
                                                        nodeId={`${fastaIndex}-new`} 
                                                        label="Create New Figure" 
                                                        icon={
                                                            <AddBox 
                                                                color="primary" 
                                                                classes={{colorPrimary:blue}} 
                                                            />
                                                        }
                                                        onClick={()=>
                                                        {
                                                            props.builder.newFigure(fasta);
                                                        }}
                                                    /> 
                                                </TreeItem>
                                            );
                                        })} 
                                </TreeView>
                            </Grid>
                        </Grid>
                    </div>
                </GridWrapper>
            </div>
        </Overlay>
    );
}
