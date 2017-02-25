/*
    Handles fastq and fasta files.
    
	Part of the PHAT Project
	Author : gibbc@tbh.net
*/
var fastq = require('./fastq');
var fasta = require('./fasta');
var formatByteString = require('./formatByteString');
var canRead = require('./canRead');
var fs = require('fs');
var model = require('./model');
var replyFromBowTie2Build = require('./input/replyFromBowTie2Build');
var replyFromFaToTwoBit = require('./input/replyFromFaToTwoBit');
var replyFromSamTools = require('./input/replyFromSamTools');

module.exports = class extends model
{
    constructor(channel,handlers)
    {
        super(channel,handlers);
        this.fastqInputs = new Array();
        this.fastaInputs = new Array();
        
        //allow the environment to change default paths for required foreign modules
        this.faToTwoBit = this.fsAccess('resources/app/faToTwoBit');
        this.samTools = this.fsAccess('resources/app/samtools');
        this.bowTie2Build = this.fsAccess('resources/app/bowtie2-build');
    }
    postFastqInputs()
    {
        this.postHandle(this.channel,{action : 'postState', key : 'fastqInputs', val : this.fastqInputs});
    }
    postFastaInputs()
    { 
        this.postHandle(this.channel,{action : 'postState', key : 'fastaInputs', val : this.fastaInputs});
    }
    addFastq(name)
    {
        if(!canRead(this.fsAccess(name)))
            return false;
        this.fastqInputs.push(new fastq(this.fsAccess(name)));

        //use Node's statSync to get filesize
        var stats = fs.statSync(name);

        for(let i = 0; i != this.fastqInputs.length; ++i)
	    {
		    if(this.fastqInputs[i].name == name) 
            {
                this.fastqInputs[i].size = parseInt(stats["size"]);
                this.fastqInputs[i].sizeString = formatByteString(parseInt(stats["size"]));
            }
	    }
        return true;
    }
    addFasta(name)
    {
        if(!canRead(this.fsAccess(name)))
            return false;
        this.fastaInputs.push(new fasta(this.fsAccess(name)));

        //use Node's statSync to get filesize
        var stats = fs.statSync(name);
        for(let i = 0; i != this.fastaInputs.length; ++i)
	    {
		    if(this.fastaInputs[i].name == name) 
            {
                this.fastaInputs[i].size = parseInt(stats["size"]);
                this.fastaInputs[i].sizeString = formatByteString(parseInt(stats["size"]));
            }
	    }
        return true;
    }
    indexFasta(name)
    {
        for(let i = 0; i != this.fastaInputs.length; ++i)
        {
            if(this.fastaInputs[i].name == name)
            {
                if(!this.fastaInputs[i].indexing && !this.fastaInputs[i].indexed)
                {
                    this.fastaInputs[i].indexing = true;
                    this.spawnHandle
                    (
                        'spawn',
                        {
                            action : 'spawn',
                            replyChannel : 'input',
                            processName : this.faToTwoBit,
                            args : [this.fastaInputs[i].name,this.fsAccess('resources/app/rt/indexes/'+this.fastaInputs[i].alias+'.2bit')],
                            unBuffer : true,
                            extraData : this.fastaInputs[i].alias
                        }
                    );
                    return true;
                }
            }
        }
        return false;
    }
    fastqExists(name)
    {
        for(let i = 0; i != this.fastqInputs.length; ++i)
	    {
		    if(this.fastqInputs[i].name == name)
			    return true;
	    }
	    return false;
    }
    fastaExists(name)
    {
        for(let i = 0; i != this.fastaInputs.length; ++i)
	    {
		    if(this.fastaInputs[i].name == name)
			    return true;
	    }
	    return false;
    }
    spawnReply(channel,arg)
    {
        if(arg.processName == this.faToTwoBit)
            return replyFromFaToTwoBit(channel,arg,this);
        if(arg.processName == this.samTools)
            return replyFromSamTools(channel,arg,this);
        if(arg.processName == this.bowTie2Build)
            return replyFromBowTie2Build(channel,arg,this);
    }
}