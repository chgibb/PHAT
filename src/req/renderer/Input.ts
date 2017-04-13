/*
    Handles fastq and fasta files.
    
	Part of the PHAT Project
	Author : gibbc@tbh.net
*/
import {SaveKeyEvent} from "./../ipcEvents";

import Fastq from "./../fastq";
import {Fasta} from "./../fasta";
import {AtomicOperationIPC} from "./../atomicOperationsIPC";
import canRead from "./canRead";
//import replyFromBowTie2Build from "./input/replyFromBowTie2Build";
//import replyFromFaToTwoBit from "./input/replyFromFaToTwoBit";
//import replyFromSamTools from "./input/replyFromSamTools";

import * as fs from "fs";

import {DataModelHandlers,DataModelMgr} from "./model";
import {SpawnRequestParams} from "./../JobIPC";

export default class Input extends DataModelMgr
{
    public fastqInputs : Array<Fastq>;
    public fastaInputs : Array<Fasta>;
    public faToTwoBit : string;
    public samTools : string;
    public copy : string;
    public bowTie2Build : string;
    public constructor(channel : string,ipc : any)
    {
        super(channel,ipc);
        this.fastqInputs = new Array<Fastq>();
        this.fastaInputs = new Array();
    }
    postFastqInputs() : void
    {
        this.ipcHandle.send(
            "saveKey",
            <SaveKeyEvent>{
                action : "saveKey",
                channel : this.channel,
                key : "fastqInputs",
                val : this.fastqInputs
            }
        );
    }
    postFastaInputs() : void
    { 
        this.ipcHandle.send(
            "saveKey",
            <SaveKeyEvent>{
                action : "saveKey",
                channel : this.channel,
                key : "fastaInputs",
                val : this.fastaInputs
            }
        );
    }
    addFastq(path : string) : boolean
    {
        if(!canRead(path))
            return false;
        for(let i = 0; i != this.fastqInputs.length; ++i)
        {
            if(this.fastqInputs[i].path == path || this.fastqInputs[i].absPath == path)
            {
                return false;
            }
        }
        this.fastqInputs.push(new Fastq(path));
        return true;
    }
    addFasta(path : string) : boolean
    {
        if(!canRead(path))
            return false;
        for(let i = 0; i != this.fastaInputs.length; ++i)
        {
            if(this.fastaInputs[i].path == path || this.fastaInputs[i].absPath == path)
            {
                return false;
            }
        }
        this.fastaInputs.push(new Fasta(path));
        return true;
    }
    indexFasta(fasta : Fasta) : boolean
    {
        this.ipcHandle.send(
            "runOperation",<AtomicOperationIPC>{
                opName : "indexFasta",
                channel : this.channel,
                key : "fastaInputs",
                uuid : fasta.uuid
            }
        );
        /*
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
        }*/
        return false;
    }
    fastqExists(uuid : string) : boolean
    {
        for(let i = 0; i != this.fastqInputs.length; ++i)
	    {
		    if(this.fastqInputs[i].uuid == uuid)
			    return true;
	    }
	    return false;
    }
    fastaExists(uuid : string) : boolean
    {
        for(let i = 0; i != this.fastaInputs.length; ++i)
	    {
		    if(this.fastaInputs[i].uuid == uuid)
			    return true;
	    }
	    return false;
    }
}