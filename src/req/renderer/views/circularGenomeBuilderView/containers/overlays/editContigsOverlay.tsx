import * as React from "react";

import { CircularFigure } from '../../../../circularFigure/circularFigure';
import { Overlay } from './overlay';
import { GridWrapper } from '../../../../containers/gridWrapper';
import { Grid } from '../../../../components/grid';
import { Typography } from '../../../../components/typography';
import { TreeView } from '../../../../components/treeView';
import { ChevronRight } from '../../../../components/icons/chevronRight';
import { ExpandMore } from '../../../../components/icons/expandMore';
import { blue } from '../../../../styles/colours';
import { TreeItem } from '../../../../components/treeItem';
import { AddBox } from '../../../../components/icons/addBox';

export interface EditContigsOverlayProps
{
    onClose : () => void;
    open : boolean;
    figure : CircularFigure;
}

export function EditContigsOverlay(props : EditContigsOverlayProps) : JSX.Element
{
    return (
        <Overlay
            kind="modal"
            open={props.open}
            onClose={props.onClose}
            restrictions={[]}
        >
            <div>
                <GridWrapper>
                    <div style={{marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh"}}>
                        <Grid container spacing={4} justify="center">
                            <Grid item>
                                <Typography variant="h5">Edit Contigs</Typography>
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
                                        <TreeItem nodeId={'0'} label="Reference Contigs">
                                            {
                                                props.figure.contigs.map((contig,i) => {
                                                    return (
                                                        <TreeItem
                                                            nodeId={`0-${i}`}
                                                            label={contig.name}
                                                        />
                                                    );
                                                })
                                            }
                                        </TreeItem>
                                        <TreeItem nodeId={'1'} label="Custom Contigs">
                                        <TreeItem 
                                                        nodeId={`1-new`} 
                                                        label="Create New Custom Contig" 
                                                        icon={
                                                            <AddBox 
                                                                color="primary" 
                                                                classes={{colorPrimary:blue}} 
                                                            />
                                                        }
                                        />
                                        </TreeItem>
                                    </TreeView>
                                    </Grid>
                                    </Grid>
                                    </div>
                                    </GridWrapper>
                </div>
        </Overlay>
    );
}