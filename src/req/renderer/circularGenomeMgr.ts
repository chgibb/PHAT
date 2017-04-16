import * as fs from "fs";

import {DataModelMgr} from "./model";
import {SpawnRequestParams} from "./../JobIPC";
import {SaveKeyEvent} from "../ipcEvents";
import {Fasta} from "./../fasta";

export class CircularGenomeMgr extends DataModelMgr
{
    public constructor(channel : string,ipcHandle : {send(channel : string, ...args : any[]) : void})
    {
        super(channel,ipcHandle);
    }
    spawnReply(channel : string,arg : SpawnRequestParams) : void{}
}