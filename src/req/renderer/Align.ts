import * as fs from "fs";

import canRead from "./canRead";
import Fastq from "./fastq";
import Fasta from "./fasta";
import alignData from "./alignData";
import {DataModelHandlers,DataModelMgr} from "./model";
import {SpawnRequestParams} from "./../JobIPC";

import replyFromBowTie2Align from "./Align/replyFromBowTie2Align";
import replyFromSamTools from "./Align/replyFromSamTools";
export default class AlignMgr extends DataModelMgr
{
    public aligns : Array<alignData>;
    public bowTie2 : string;
    public samTools : string;
    public constructor(channel : string,handlers : DataModelHandlers)
    {
        super(channel,handlers);
        this.aligns = new Array();
        if(process.platform == "linux")
            this.bowTie2 = this.fsAccess('resources/app/bowtie2');
        else if(process.platform == "win32")
             this.bowTie2 = this.fsAccess('resources/app/perl/perl/bin/perl.exe')
        this.samTools = this.fsAccess('resources/app/samtools');
    }
    postAligns()
    {
        //this.postHandle(this.channel,{action : 'postState', key : 'aligns', val : this.aligns});
        this.postHandle(
            "saveKey",
            {
                action : "saveKey",
                channel : this.channel,
                key : "aligns",
                val : this.aligns
            }
        );
    }
    runAlignment(fastqs : Array<Fastq>,refIndex : Fasta,type : string) : boolean
    {
        /*
            Determine whether the two are paired?
        */
        let paired = false;
        if(fastqs.length == 2)
            paired = true;
        /*
            If either of the fastQ files are unreadable, return false.
        */
        if(!canRead(fastqs[0].name) || !canRead(fastqs[1].name))
            return false;
        
        let alignReport : alignData;
        try
        {
            if(paired)
            {
                alignReport = new alignData
                (
                    [
                        fastqs[0],
                        fastqs[1]
                    ],
                    refIndex
                );
            }
        }
        catch(err){console.log(err);return false;}
        alignReport.type = type;


        let inref = this.fsAccess("resources/app/rt/indexes/"+refIndex.alias);
        let outsam = this.fsAccess("resources/app/rt/AlignmentArtifacts/"+alignReport.UUID+"/out.sam");


        let args = new Array();
        if(process.platform == "win32")
            args.push(this.fsAccess("resources/app/bowtie2"));
        args.push
        (
            "-x",
            inref
        );
        if(paired)
        {
            args.push
            (
                "-1",
                fastqs[0].name,
                "-2",
                fastqs[1].name
            );  
        }

        args.push
        (
            "-S",
            this.fsAccess("resources/app/rt/AlignmentArtifacts/"+alignReport.UUID+"/out.sam")
        );

        let invokeString = "";
        for(let i = 0; i != args.length; ++i)
        {
            invokeString += args[i];
            invokeString += " ";
        }

        alignReport.invokeString = invokeString;
        alignReport.alias = fastqs[0].alias+", "+fastqs[1].alias+"; "+refIndex.alias+"";
        
        fs.mkdirSync(this.fsAccess("resources/app/rt/AlignmentArtifacts/"+alignReport.UUID));


        this.aligns.push(alignReport);
        this.spawnHandle
        (
            'spawn',
            {
                action : 'spawn',
                replyChannel : this.channel,
                processName : this.bowTie2,
                args,
                unBuffer : true,
                extraData : alignReport.UUID
            }
        );

        return true;
    }
    spawnReply(channel : string,arg : SpawnRequestParams) : void
    {
        if(arg.processName == this.bowTie2)
            replyFromBowTie2Align(channel,arg,this);
        if(arg.processName == this.samTools)
            replyFromSamTools(channel,arg,this);
    }
}