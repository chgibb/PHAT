import * as React from "react";

import {CircularFigure} from "../../../../circularFigure/circularFigure";
import {GridWrapper} from "../../../../containers/gridWrapper";
import {Grid} from "../../../../components/grid";
import {Typography} from "../../../../components/typography";
import {TreeView} from "../../../../components/treeView";
import {ChevronRight} from "../../../../components/icons/chevronRight";
import {ExpandMore} from "../../../../components/icons/expandMore";
import {blue} from "../../../../styles/colours";
import {TreeItem} from "../../../../components/treeItem";
import {AddBox} from "../../../../components/icons/addBox";
import {getReferenceFromUuid} from "../../../../../uniquelyAddressable";

import {Overlay} from "./overlay";
import {EditContigOverlay, EditContigOverlayProps} from "./editContigOverlay";

export interface EditContigsOverlayProps {
    onClose: () => void;
    onSave : EditContigOverlayProps["onSave"];
    open: boolean;
    figure: CircularFigure;
}

export interface EditContigsOverlayState {
    selectedContigUuid: string;
    allowMovingSelectContig : boolean;
}
export class EditContigsOverlay extends React.Component<EditContigsOverlayProps, EditContigsOverlayState>
{
    public constructor(props: EditContigsOverlayProps) 
    {
        super(props);

        this.state = {
            selectedContigUuid: "",
            allowMovingSelectContig : false
        };
    }
    public render(): JSX.Element 
    {
        const contig = getReferenceFromUuid(this.props.figure.contigs, this.state.selectedContigUuid);

        return (
            <Overlay
                kind="drawerRight"
                restrictions={["noModal"]}
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <div>
                    {
                        contig ? <EditContigOverlay
                            onClose={() => 
                            {
                                this.setState({
                                    selectedContigUuid: ""
                                });
                            }}
                            onSave={this.props.onSave}
                            figure={this.props.figure}
                            contig={contig}
                            allowMovingSelectContig={this.state.allowMovingSelectContig}
                        /> :
                            <React.Fragment>
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
                                                    defaultExpandIcon={<ChevronRight color="primary" classes={{colorPrimary: blue}} />}
                                                    defaultCollapseIcon={<ExpandMore color="primary" classes={{colorPrimary: blue}} />}
                                                >
                                                    <TreeItem nodeId={"0"} label="Reference Contigs">
                                                        {
                                                            this.props.figure.contigs.map((contig, i) => 
                                                            {
                                                                return (
                                                                    <TreeItem
                                                                        nodeId={`0-${i}`}
                                                                        label={contig.name}
                                                                        onClick={() => 
                                                                        {
                                                                            this.setState({
                                                                                selectedContigUuid: contig.uuid
                                                                            });
                                                                        }}
                                                                    />
                                                                );
                                                            })
                                                        }
                                                    </TreeItem>
                                                    <TreeItem nodeId={"1"} label="Custom Contigs">
                                                        <TreeItem
                                                            nodeId={"1-new"}
                                                            label="Create New Custom Contig"
                                                            icon={
                                                                <AddBox
                                                                    color="primary"
                                                                    classes={{colorPrimary: blue}}
                                                                />
                                                            }
                                                        />
                                                    </TreeItem>
                                                </TreeView>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </GridWrapper>
                            </React.Fragment>
                    }
                </div>
            </Overlay>
        );
    }
}