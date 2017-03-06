/*
    Handles fastq and fasta files.
    
	Part of the PHAT Project
	Author : gibbc@tbh.net
*/
var fastq = require('./fastq');
var fasta = require('./fasta');
var formatByteString = require('./formatByteString');
var canRead = require('./canRead');
//var fs = require('fs');
//var model = require('./model');
var replyFromBowTie2Build = require('./input/replyFromBowTie2Build');
var replyFromFaToTwoBit = require('./input/replyFromFaToTwoBit');
var replyFromSamTools = require('./input/replyFromSamTools');

import * as fs from "fs";

import {DataModelHandlers,DataModelMgr} from "./model";
import {SpawnRequestParams} from "./../JobIPC";

export default class Input extends DataModelMgr
{
    public fastqInputs : Array<any>;
    public fastaInputs : Array<any>;
    public faToTwoBit : string;
    public samTools : string;
    public copy : string;
    public bowTie2Build : string;
    public constructor(channel : string,handlers : DataModelHandlers)
    {
        super(channel,handlers);
        this.fastqInputs = new Array();
        this.fastaInputs = new Array();
        
        //allow the environment to change default paths for required foreign modules
        this.faToTwoBit = this.fsAccess('resources/app/faToTwoBit');
        this.samTools = this.fsAccess('resources/app/samtools');
        this.copy = this.fsAccess('resources/app/copy');
        if(process.platform == "linux")
            this.bowTie2Build = this.fsAccess('resources/app/bowtie2-build');
        else if(process.platform == "win32")
            this.bowTie2Build = this.fsAccess('resources/app/python/python.exe');
    }
    postFastqInputs()
    {
        this.postHandle(this.channel,{action : 'postState', key : 'fastqInputs', val : this.fastqInputs});
    }
    postFastaInputs()
    { 
        this.postHandle(this.channel,{action : 'postState', key : 'fastaInputs', val : this.fastaInputs});
    }
    addFastq(name : string)
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
    addFasta(name : string)
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
    indexFasta(name : string)
    {
        for(let i = 0; i != this.fastaInputs.length; ++i)
        {
            if(this.fastaInputs[i].name == name)
            {
                if(!this.fastaInputs[i].indexing && !this.fastaInputs[i].indexed)
                {
                    this.fastaInputs[i].indexing = true;
                    let args = [this.fastaInputs[i].name,this.fsAccess('resources/app/rt/indexes/'+this.fastaInputs[i].alias+'.2bit')];
                    this.spawnHandle
                    (
                        'spawn',
                        {
                            action : 'spawn',
                            replyChannel : 'input',
                            processName : this.faToTwoBit,
                            args : args,
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
    fastqExists(name : string)
    {
        for(let i = 0; i != this.fastqInputs.length; ++i)
	    {
		    if(this.fastqInputs[i].name == name)
			    return true;
	    }
	    return false;
    }
    fastaExists(name : string)
    {
        for(let i = 0; i != this.fastaInputs.length; ++i)
	    {
		    if(this.fastaInputs[i].name == name)
			    return true;
	    }
	    return false;
    }
    spawnReply(channel : string,arg : SpawnRequestParams)
    {
        if(arg.processName == this.faToTwoBit)
            replyFromFaToTwoBit(channel,arg,this);
        if(arg.processName == this.samTools)
            replyFromSamTools(channel,arg,this);
        if(arg.processName == this.bowTie2Build)
            replyFromBowTie2Build(channel,arg,this);
    }
}