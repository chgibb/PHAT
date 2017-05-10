import * as fs from "fs";
import * as cp from "child_process";

const semver = require("semver");

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent,AtomicOperationIPC} from "./../atomicOperationsIPC";

const pjson = require("./package.json");
export class CheckForUpdate extends atomic.AtomicOperation
{
    public token : string;
    public availableUpdate : boolean;
    public updateTagName : string;

    public checkForUpdateProcess : cp.ChildProcess;
    constructor()
    {
        super();
    }
    public setData(data : AtomicOperationIPC) : void
    {
        this.token = data.token;
    }
    public run() : void
    {
        let self = this;
        this.checkForUpdateProcess = cp.fork("resources/app/CheckForUpdateProcess.js");

        setTimeout(
            function(){
                self.checkForUpdateProcess.send(
                    <AtomicOperationForkEvent>{
                        setData : true,
                        data : <AtomicOperationIPC>{
                            token : self.token
                        }
                    }
                );
            },500
        );
    }
}