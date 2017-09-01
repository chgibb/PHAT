import * as electron from "electron";
const BrowserWindow = electron.remote.BrowserWindow;


const psNode = require("ps-node");

import {PIDInfo} from "./PIDInfo";


export async function getPIDInfo(pid : number) : Promise<Array<PIDInfo>>
{
    let res = new Array<PIDInfo>();
    return new Promise<Array<PIDInfo>>((resolve,reject) => {
        psNode.lookup({pid : pid},function(err : Error,resultList : Array<any>){
            if(err)
                reject(err);
            for(let i = 0; i != resultList.length; ++i)
            {
                let info = <PIDInfo>{
                    pid : resultList[i].pid,
                    ppid : resultList[i].ppid,
                    command : resultList[i].command,
                    arguments : resultList[i].arguments
                };

                res.push(info);
            }
            resolve(res);
        });
    }); 
}