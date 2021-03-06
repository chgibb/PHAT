import * as React from "react";

import {Fastq} from "../../../../fastq";
import {Form, FullWidthFormStep, FullWidthStepperForm} from "../../fullWidthStepperForm";
import {Fasta} from "../../../../fasta";
import {DropResult, ResponderProvided, DragAndDropContainer} from "../../dragAndDropContainer";
import {reOrder} from "../../../../reOrder";
import {getPropertiesOfReferencesFromUuids, getReferencesFromUuids} from "../../../../uniquelyAddressable";
import {FastqTable} from "../../tables/fastqTable";
import {GridWrapper} from "../../gridWrapper";
import {headingPadding} from "../../../views/alignView/styles/headingPadding";
import {paperPadding} from "../../../styles/paperPadding";
import {FastaTable} from "../../tables/fastaTable";
import {ThreeQuartersLoader} from "../../../components/threeQuartersLoader";
import {Grid} from "../../../components/grid";
import {Typography} from "../../../components/typography";
import {Paper} from "../../../components/paper";
import {FormControl} from "../../../components/formControl";
import {RadioGroup} from "../../../components/radioGroup";
import {FormControlLabel} from "../../../components/formControlLabel";
import {Radio} from "../../../components/radio";
import {Button} from "../../../components/button";

import {triggerBowtie2Alignment, triggerHisat2Alignment} from "./publish";

export interface RunAlignmentFormProps
{
    fastqs? : Array<Fastq>;
    
    fastas? : Array<Fasta>;
    
    shouldAllowTriggeringOps : boolean;
}

export interface RunAlignmentFormState
{
    selectedFastqUuids? : Array<string>;
    selectedFastaUuids? : Array<string>;
    selectedAligner? : "bowtie2" | "hisat2" | undefined;
    errors : Array<string>;
    currentStep : number;
}

export class RunAlignmentForm 
    extends React.Component<RunAlignmentFormProps,RunAlignmentFormState>
    implements Form
{
    public state : RunAlignmentFormState;
    public portal : HTMLElement;
    public constructor(props : RunAlignmentFormProps)
    {
        super(props);
        
        this.state = {
            currentStep : 0
        } as RunAlignmentFormState;

        this.onFastqSelectionChange = this.onFastqSelectionChange.bind(this);
        this.onFastaSelectionChange = this.onFastaSelectionChange.bind(this);
        this.onStepTwoDragEnd = this.onStepTwoDragEnd.bind(this);
        this.onStepThreeRadioChange = this.onStepThreeRadioChange.bind(this);

        this.setState = this.setState.bind(this);

        this.portal = document.createElement("div");
        document.body.appendChild(this.portal);
    }

    public onAdvance(step : number) : Promise<boolean>
    {
        return new Promise<boolean>((resolve : (val : boolean) => void) : void =>  
        {
            if(step == 0)
            {
                if(!this.state.selectedFastqUuids || this.state.selectedFastqUuids.length < 1 || this.state.selectedFastqUuids.length > 2)
                {
                    this.setState({
                        errors : ["Select at at least 1 fastq but no more than 2."]
                    });
                    return resolve(false);
                }
            }

            if(this.state.selectedFastqUuids)
            {
                if((this.state.selectedFastqUuids.length == 1 && step == 1) || (this.state.selectedFastqUuids.length == 2 && step == 2))
                {
                    if(!this.state.selectedFastaUuids || this.state.selectedFastaUuids.length != 1)
                    {
                        this.setState({
                            errors : ["Select exactly 1 fasta to align against."]
                        });
                        return resolve(false);
                    }
                }

                if((this.state.selectedFastqUuids.length == 1 && step == 2) || (this.state.selectedFastqUuids.length == 2 && step == 3))
                {
                    if(!this.state.selectedAligner)
                    {
                        this.setState({
                            errors : ["Select an aligner"]
                        });
                        return resolve(false);
                    }
                }
            }
            this.setState({
                errors: []
            });
            return resolve(true);
        });
    }

    public onRetreat(step :  number) : Promise<boolean>
    {
        return new Promise<boolean>((resolve : (val : boolean) => void) : void => 
        {
            return resolve(true);
        });
    }

    public onFastqSelectionChange(data : Array<Fastq>) : void
    {
        this.setState({
            selectedFastqUuids : data.map((el) => el.uuid)
        });
    }

    public onFastaSelectionChange(data : Array<Fasta>) : void
    {
        this.setState({
            selectedFastaUuids: data.map((el) => el.uuid)
        });
    }

    public onStepTwoDragEnd(result : DropResult,provider : ResponderProvided) : void
    {
        if(!result.destination)
            return;
        this.setState({
            selectedFastqUuids : reOrder(
                this.state.selectedFastqUuids!,
                result.source.index,
                result.destination.index
            )});
    }

    public onStepThreeRadioChange(event : React.ChangeEvent<{}>,value : "bowtie2" | "hisat2") : void
    {
        this.setState({
            selectedAligner : value
        });
    }

    public render() : JSX.Element
    {
        let selectedFastqsAliases : Array<string> | undefined = undefined;
        let selectedFastqsObjs : Array<Fastq> | undefined = undefined;

        if(this.props.fastqs && this.state.selectedFastqUuids)
        {
            selectedFastqsAliases = getPropertiesOfReferencesFromUuids(
                this.props.fastqs,
                this.state.selectedFastqUuids,
                "alias"
            );

            selectedFastqsObjs = getReferencesFromUuids(
                this.props.fastqs,
                this.state.selectedFastqUuids
            );
        }

        let selectedFastaObjs : Array<Fasta> | undefined = undefined;

        if(this.state.selectedFastaUuids)
        {
            selectedFastaObjs = getReferencesFromUuids(
                this.props.fastas,
                this.state.selectedFastaUuids
            );
        }

        

        let steps : Array<FullWidthFormStep> = new Array();

        steps.push({
            label : !this.state.selectedFastqUuids || this.state.selectedFastqUuids.length == 0 ? "Select fastq(s) to align" : `Selected${"\n"}${selectedFastqsAliases!.join(",\n")}`,
            body : (
                <FastqTable
                    selection={true}
                    onSelectionChange={this.onFastqSelectionChange}
                    data={this.props.fastqs ? this.props.fastqs : []}
                />
            )
        });

        if(this.state.selectedFastqUuids && this.state.selectedFastqUuids.length > 1)
        {
            let stepTwoLabel = "Select orientation";
            
            if(this.state.currentStep >= 1 && selectedFastqsObjs && selectedFastqsObjs.length > 0)
            {
                stepTwoLabel = `Forward: ${selectedFastqsObjs[0].alias},${"\n"}`;

                if(selectedFastqsObjs.length > 1)
                    stepTwoLabel += `${"\n"}Reverse: ${selectedFastqsObjs[1].alias}${"\n"}`;
            }

            steps.push({
                label : stepTwoLabel,
                body : (
                    <div>
                        {this.state.selectedFastqUuids ?
                            <GridWrapper>
                                <Grid container spacing={4} justify="center">
                                    <Grid item>
                                        <Typography className={headingPadding}>
                                            Forward
                                        </Typography>
                                        <Typography>
                                            Reverse
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <DragAndDropContainer<Fastq>
                                            direction="vertical"
                                            onDragEnd={this.onStepTwoDragEnd}
                                            droppableID="droppable"
                                            draggableKey={(el) => el.uuid}
                                            draggableId={(el) => el.uuid}
                                            draggableContent={(el) => 
                                            {
                                                return (
                                                    <Paper className={paperPadding}>
                                                        <Typography variant="h5" component="h3">
                                                            {el.alias}
                                                        </Typography>
                                                        <Typography component="p">
                                                            {el.sizeString}
                                                        </Typography>
                                                    </Paper>
                                                );
                                            }}
                                            portal={this.portal}
                                            data={selectedFastqsObjs ? selectedFastqsObjs : []}
                                        />
                                    </Grid>
                                </Grid>
                            </GridWrapper> 
                            : ""}
                    </div>
                )
            });
        }

        steps.push({
            label : !selectedFastaObjs ? "Select reference to align against" : `Selected ${selectedFastaObjs[0].alias}`,
            body : (
                <div>
                    <FastaTable
                        actions={false}
                        data={this.props.fastas ? this.props.fastas : []}
                        shouldAllowTriggeringOps={true}
                        onIndexForVizClick={()=>null}
                        selection={true}
                        onSelectionChange={this.onFastaSelectionChange}
                    />
                </div>
            )
        });

        steps.push({
            label : !this.state.selectedAligner ? "Select aligner" : `Selected ${this.state.selectedAligner}`,
            body : (
                <div>
                    <GridWrapper>
                        <Grid container spacing={4} justify="center">
                            <Grid item>
                                <FormControl component="fieldset">
                                    <RadioGroup onChange={(event : React.ChangeEvent<{}>,value : string) => 
                                    {
                                        if(value == "bowtie2" || value == "hisat2")
                                            this.onStepThreeRadioChange(event,value);
                                    }}>
                                        <FormControlLabel
                                            checked={this.state.selectedAligner == "bowtie2"} 
                                            value="bowtie2"
                                            control={<Radio color="primary" />}
                                            label="Bowtie2"
                                            id="bowtie2Radio"
                                        />
                                        <FormControlLabel
                                            checked={this.state.selectedAligner == "hisat2"} 
                                            value="hisat2"
                                            control={<Radio color="primary" />}
                                            label="Hisat2"
                                            id="hisat2Radio"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </GridWrapper>
                </div>
            )
        });

        steps.push({
            label : "Review and begin",
            body : (
                <div>
                    {selectedFastqsObjs && selectedFastaObjs && this.state.selectedAligner ?
                        <div>
                            <GridWrapper>
                                <Grid container spacing={4} justify="center">
                                    <Grid item>
                                        <Paper>
                                            <Typography variant="h5" component="h3">
                                                Align {selectedFastqsObjs[0] ? `${selectedFastqsObjs[0].alias} forward, ` : ""} {selectedFastqsObjs[1] ? `${selectedFastqsObjs[1].alias} reverse, ` : ""} {"against "}
                                                {selectedFastaObjs[0].alias} using {this.state.selectedAligner}.
                                            </Typography>
                                            
                                            <GridWrapper>
                                                <Grid container spacing={4} justify="center">
                                                    <Grid item>
                                                        {this.props.shouldAllowTriggeringOps ? <Button
                                                            label="Start"
                                                            type="remain"
                                                            id="startAlignment"
                                                            onClick={() => 
                                                            {
                                                                if(this.state.selectedAligner == "bowtie2")
                                                                {
                                                                    triggerBowtie2Alignment(
                                                                        selectedFastaObjs![0],
                                                                        selectedFastqsObjs![0],
                                                                        selectedFastqsObjs![1]
                                                                    );
                                                                }

                                                                if(this.state.selectedAligner == "hisat2")
                                                                {
                                                                    triggerHisat2Alignment(
                                                                        selectedFastaObjs![0],
                                                                        selectedFastqsObjs![0],
                                                                        selectedFastqsObjs![1]
                                                                    );
                                                                }
                                                            }}
                                                        /> :
                                                            <ThreeQuartersLoader />
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </GridWrapper>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </GridWrapper>
                        </div>
                        : ""}
                </div>
            )
        });

        return (
            <div>
                <div>
                    <FullWidthStepperForm 
                        form={this}
                        setFormState={this.setState}
                        steps={steps}
                    />
                </div>
            </div>
        );
    }
}
