import * as fs from "fs";

import {DataModelMgr} from "./model";
import {SpawnRequestParams} from "./../JobIPC";
import {SaveKeyEvent} from "../ipcEvents";
import {Fasta} from "./../fasta";
export class CircularFigure
{
    public uuid : string;
    public name : string;
    public contigs : any;
    public radius : number;
    public height : number;
    public width : number;
    constructor(name : string,contigs : any)
    {
        this.name = name;
        this.contigs = contigs;
        this.radius = 120;
        this.height = 300;
        this.width = 300;
    }
}
export class CircularGenomeMgr extends DataModelMgr
{
    public constructor(channel : string,ipcHandle : {send(channel : string, ...args : any[]) : void})
    {
        super(channel,ipcHandle);
    }
    spawnReply(channel : string,arg : SpawnRequestParams) : void{}
}