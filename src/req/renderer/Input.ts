import {SaveKeyEvent} from "./../ipcEvents";

import Fastq from "./../fastq";
import {Fasta} from "./../fasta";
import {AtomicOperationIPC} from "./../atomicOperationsIPC";
import canRead from "./canRead";

import * as fs from "fs";

import {DataModelMgr} from "./model";
import {SpawnRequestParams} from "./../JobIPC";

export default class Input extends DataModelMgr
{
    public fastqInputs : Array<Fastq>;
    public fastaInputs : Array<Fasta>;
    public faToTwoBit : string;
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
        let hasComma : RegExp = new RegExp("(,)","g");
        if(hasComma.test(path))
            throw new Error("Comma in path");
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