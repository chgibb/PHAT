var fs = require('fs');
var model = require('./model');
var canRead = require('./canRead');
var fastq = require('./fastq');
var fasta = require('./fasta');
var alignData = require('./alignData');
var replyFromBowTie2Align = require('./Align/replyFromBowTie2Align');
var replyFromSamTools = require('./Align/replyFromSamTools');

module.exports = class extends model
{
    constructor(channel,handlers)
    {
        super(channel,handlers);
        this.aligns = new Array();
        this.bowTie2 = this.fsAccess('resources/app/bowtie2');
        this.samTools = this.fsAccess('resources/app/samtools');
    }
    postAligns()
    {
        this.postHandle(this.channel,{action : 'postState', key : 'aligns', val : this.aligns});
    }
    runAlignment(fastqs,refIndex,type)
    {
        if(!Array.isArray(fastqs))
            return false;
        if(fastqs.length > 2)
            return false;
        
        var paired = false;
        if(fastqs.length == 2)
            paired = true;
        if(!canRead(fastqs[0].name) || !canRead(fastqs[1].name))
            return false;
        var alignReport = {};
        try
        {
            if(paired)
            {
                alignReport = new alignData.Data
                (
                    [
                        fastqs[0].alias,
                        fastqs[1].alias
                    ],
                    refIndex.alias
                );
            }
        }
        catch(err){console.log(err);return false;}
        alignReport.type = type;


        var inref = this.fsAccess("resources/app/rt/indexes/"+refIndex.alias);
        var outsam = this.fsAccess("resources/app/rt/AlignmentArtifacts/"+alignReport.UUID+"/out.sam");


        var args = new Array();
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

        var invokeString = "";
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
    spawnReply(channel,arg)
    {
        if(arg.processName == this.bowTie2)
            replyFromBowTie2Align(channel,arg,this);
        if(arg.processName == this.samTools)
            replyFromSamTools(channel,arg,this);
    }
}