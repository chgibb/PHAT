/// <reference types="jquery" />
import * as Path from "path";

import {bootStrapCodeCache} from "./../../bootStrapCodeCache";
import {getReadable,getReadableAndWritable} from "./../../getAppPath";
import {Fasta,get2BitPath} from "./../../fasta";
import alignData from "./../../alignData";
import * as viewMgr from "./../viewMgr";

export class PileUpView extends viewMgr.View
{
    public report : string;
    public viewer : any;
    public selectedFastaInputs : Array<Fasta>;
    public aligns : Array<alignData>;
    constructor(div : string)
    {
        super('pileUp',div);
        this.report = "";
        this.viewer = {};
        this.selectedFastaInputs = new Array<Fasta>();
        this.aligns = new Array<alignData>();
    }
    onMount()
    {
        var twoBit;
        var refName;
        var bam;
        var bai;
        var bamName;
        var contig;

        for(let i = 0; i != this.aligns.length; ++i)
        {
            if(this.aligns[i].uuid == this.report)
            {
                twoBit = get2BitPath(this.aligns[i].fasta);
                contig = this.aligns[i].fasta.contigs[0].name.split(' ')[0];
                bam = getReadableAndWritable("rt/AlignmentArtifacts/"+this.report+"/out.sorted.bam");
                bai = getReadableAndWritable("rt/AlignmentArtifacts/"+this.report+"/out.sorted.bam.bai");
                bamName = this.aligns[i].alias;
                break;
            }
        }
        this.viewer = (<any>window).pileup.create
        (
            document.getElementById(this.div),
            {
                range  :
                {
                    contig : contig,
                    start : 0,
                    stop : 100
                },
                tracks : 
                [
                    {
                        viz : (<any>window).pileup.viz.genome(),
                        isReference : true,
                        data : (<any>window).pileup.formats.twoBit
                        (
                            {
                                url : Path.resolve(twoBit)
                            }
                        ),
                        name : refName
                    },
                    {
                        viz : (<any>window).pileup.viz.pileup(),
                        data : (<any>window).pileup.formats.bam
                        (
                            {
                                url : Path.resolve(bam),
                                indexUrl :Path.resolve(bai)
                            }
                        ),
                        cssClass : 'normal',
                        name : bamName
                    }
                ]
            }
        );
        var html = "";
        html += "<button id='goBack'>Go Back</button><br/>";
                
        document.getElementById("goBackDiv").innerHTML = html;
        var me = this;
        document.getElementById("goBack").addEventListener
        (
            "click",
            function(ev)
            {
                me.report = "";
                viewMgr.changeView('report');
            },
            false
        );
        //fix a pileup.js bug where the reference track is hidden until a resize event.
        //Pileup's loading routines are all async, so wait a second and then trigger a resize to show the reference track.
        setTimeout
		(
		    function()
			{
			    window.dispatchEvent
				(
				    new Event('resize')
				);
			},
			1000
		);
    }
    onUnMount()
    {
        this.viewer.destroy();
        document.getElementById("goBackDiv").innerHTML = "";
    }
    renderView()
    {
        return "";
    }
    postRender(){}
    divClickEvents(event : JQueryEventObject) : void
    {
        if(!event || !event.target || !event.target.id)
            return;
        if(event.target.id == "goBack")
        {
            this.report = "";
            viewMgr.changeView('report');
            return;
        }
    }
    dataChanged(){}
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new PileUpView(div));
}
