/// <reference types="jquery" />
import * as electron from "electron";
const ipc = electron.ipcRenderer;

import * as viewMgr from "./../viewMgr";
import Fastq from "./../../fastq";
import {Fasta} from "./../../fasta";
import {AtomicOperationIPC} from "./../../atomicOperationsIPC";

class ConfirmOptions extends viewMgr.View
{
    public selectedFastqs : Array<string>;
    public selectedFasta : string;
    public constructor()
    {
        super('confirmOptions','confirmOptions');
        this.selectedFastqs = new Array<string>();
        this.selectedFasta = "";
    }
    renderView()
    {
        let html = new Array();
        if(this.selectedFastqs && this.selectedFasta)
        {
            html.push
            (
                "<p>Align <b>",this.selectedFastqs[0],"</b>,<b> ",this.selectedFastqs[1],"</b></p>",
                "<p>Against <b>",this.selectedFasta,"</b></p>"
            );
        }
        return html.join('');
    }
    onMount(){}
    onUnMount(){}
    postRender(){}
    divClickEvents(event : JQueryEventObject){}
    dataChanged(){}
}

export class ReportView extends viewMgr.View
{
    public fastqInputs : Array<Fastq>;
    public fastaInputs : Array<Fasta>;

    public selectedFastqs : Array<Fastq>;
    public selectedFasta : Fasta;

    public tab : "path" | "host";

    public confirmOptions : ConfirmOptions;
    public constructor(div : string)
    {
        super('report',div);
        this.fastqInputs = new Array<Fastq>();
        this.fastaInputs = new Array<Fasta>();


        this.selectedFastqs = new Array<Fastq>();

        this.tab = "path";

        this.confirmOptions = new ConfirmOptions();
    }
    onMount(){}
    onUnMount(){}
    dataChanged(){}
    renderView()
    {
        let html = new Array();
        //fastq table
        html.push
        (
            "<div id='fastqs' style='overflow-y:scroll;height:100px;border : 1px solid black;background-color : rgba(163, 200, 255, 1);'>",
            "<table style='width:100%'>",
            "<tr>",
            "<th>Name</th>",
            "<th>Use</th>",
            "</tr>"
        );
        for(let i = 0; i != this.fastqInputs.length; ++i)
        {
            if(this.fastqInputs[i].checked)
            {
                html.push
                (
                    "<tr>",
                    "<td>",this.fastqInputs[i].alias,"</td>",
                    "<td>","<input type='checkbox' id='",this.fastqInputs[i].uuid,"'></input></td>",
                    "</tr>"
                );
            }
        }
        html.push("</table></div><br /><br />");

        html.push("<img id='pathTab' src='img/buttonPathogen.png'>");
        html.push("<img id='hostTab' src='img/buttonHost.png'>");
        //fasta table
        html.push
        (
            "<div id='fastas' style='overflow-y:scroll;height:100px;border : 1px solid black;background-color : rgba(163, 200, 255, 1);'>",
            "<table style='width:100%'>",
            "<tr>",
            "<th>Name</th>",
            "<th>Align Against</th>",
            "</tr>"
        );
        for(let i = 0; i != this.fastaInputs.length; ++i)
        {
            if(this.fastaInputs[i].indexed &&
            this.fastaInputs[i].type == this.tab &&
            this.fastaInputs[i].checked)
            {
                html.push
                (
                    "<tr>",
                    "<td>",this.fastaInputs[i].alias,"</td>",
                    "<td>","<input type='radio' name='fasta' id='",this.fastaInputs[i].uuid,"'></input></td>",
                    "</tr>"
                );
            }
        }

        //div for confirmOptions view
        html.push("</table></div>");
        html.push("<div id='confirmOptions'></div>");
        html.push("<img id='alignButton' src='img/temporaryAlignButton.png'>");
        this.confirmOptions.render();
        return html.join('');
    }
    postRender()
    {
        //restore checked state of checkboxs
        for(let i = 0; i != this.selectedFastqs.length; ++i)
        {
            let elem = (<HTMLInputElement>document.getElementById(this.selectedFastqs[i].uuid));
            if(elem)
                elem.checked = true;
        }
        if(this.selectedFasta)
        {
            let elem = (<HTMLInputElement>document.getElementById(this.selectedFasta.uuid));
            if(elem)
                elem.checked = true;
        }
        $("#fastqs").css("height",$(window).height()/3+"px");
        $("#fastas").css("height",$(window).height()/5+"px");

        this.confirmOptions.render();
    }
    divClickEvents(event : JQueryEventObject)
    {
        if(!event || !event.target || !event.target.id)
            return;
        for(let i = 0; i != this.fastqInputs.length; ++i)
        {
            if(event.target.id == this.fastqInputs[i].uuid)
            {
                if(this.selectedFastqs.length >= 2)
                    (<HTMLInputElement>document.getElementById(event.target.id)).checked = false;
            }
        }
        this.populateSelectedFasta();
        this.populateSelectedFastqs();
        if(event.target.id == "pathTab")
        {
            this.tab = "path";
        }
        if(event.target.id == "hostTab")
        {
            this.tab = "host";
        }
        if(event.target.id == "alignButton")
        {
            let selected_fastq_count = 0;
            for(let i = 0; i != this.fastqInputs.length; ++i)
            {
                if(this.selectedFastqs[0] && this.selectedFastqs[0].uuid == this.fastqInputs[i].uuid)
                {
                    this.selectedFastqs[0] = this.fastqInputs[i];
                    selected_fastq_count++;
                }
                if(this.selectedFastqs[1] && this.selectedFastqs[1].uuid == this.fastqInputs[i].uuid)
                {
                    this.selectedFastqs[1] = this.fastqInputs[i];
                    selected_fastq_count++;
                    break;
                }
            }
            for(let i = 0; i != this.fastaInputs.length; ++i)
            {
                if(this.selectedFasta.uuid == this.fastaInputs[i].uuid)
                {
                    this.selectedFasta = this.fastaInputs[i];
                    break;
                }
            }

            /*
                Only run the alignment (bowtie2) if two fastQ's have been selected, 
                AND a Fasta has been selected.
            */
            if (this.selectedFasta && selected_fastq_count >= 2) {
                //alert("P.H.A.T will now align your selection.\nThis may take a few minutes.")
                ipc.send(
                    "runOperation",<AtomicOperationIPC>{
                        opName : "runAlignment",
                        alignParams : {
                            fasta : this.selectedFasta,
                            fastq1 : this.selectedFastqs[0],
                            fastq2 : this.selectedFastqs[1],
                            type : this.tab
                        }
                    }
                );
            } else {
                alert(selected_fastq_count >= 2 ? "You need to select a Fasta file!" : "You need to select two FastQ files!");
            }
            

            this.setConfirmOptions();

            viewMgr.render();
        }
    }
    populateSelectedFastqs()
    {
        this.selectedFastqs = new Array();
        //walk the table and save checked fastqs in selectedFastqs
        for(let i = 0; i != this.fastqInputs.length; ++i)
        {
            if(this.fastqInputs[i].checked &&
            (<HTMLInputElement>document.getElementById(this.fastqInputs[i].uuid)).checked)
            {
                this.selectedFastqs.push(this.fastqInputs[i]);
            }
            if(this.selectedFastqs.length >= 2)
                break;
        }
    }
    populateSelectedFasta()
    {
        this.selectedFasta = undefined
        //walk the table and save checked fasta in selectedFasta
        for(let i = 0; i != this.fastaInputs.length; ++i)
        {
            let elem = (<HTMLInputElement>document.getElementById(this.fastaInputs[i].uuid));
            if(elem && elem.checked)
            {
                this.selectedFasta = this.fastaInputs[i];
                return;
            }
        }
    }
    setConfirmOptions()
    {
        //set confirmOptions' selected arrays to be equal to this' selected arrays
        //this.confirmOptions.selectedFastqs = this.selectedFastqs;
        //this.confirmOptions.selectedFasta = this.selectedFasta;
        let setFirst = false;
        let setSecond = false;
        if(!this.selectedFastqs[0] || !this.selectedFastqs[1])
            return;
        //Selected items are saved by uuid. Convert to alias for confirmOptions to render.
        for(let i = 0; i != this.fastqInputs.length; ++i)
        {
            if(this.fastqInputs[i].checked)
            {
                if(this.selectedFastqs[0].uuid == this.fastqInputs[i].uuid)
                {
                    this.confirmOptions.selectedFastqs[0] = this.fastqInputs[i].alias;
                    setFirst = true;
                }
                if(this.selectedFastqs[1].uuid == this.fastqInputs[i].uuid)
                {
                    this.confirmOptions.selectedFastqs[1] = this.fastqInputs[i].alias;
                    setSecond = true;
                }
                if(setSecond && setFirst)
                    break;
            }
        }
        for(let i = 0; i != this.fastaInputs.length; ++i)
        {
            if(this.fastaInputs[i].checked)
            {
                if(this.selectedFasta.uuid == this.fastaInputs[i].uuid)
                {
                    this.confirmOptions.selectedFasta = this.fastaInputs[i].alias;
                    break;
                }
            }
        }
    }
}

export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new ReportView(div));
}