import * as electron from "electron";
const BrowserWindow = electron.remote.BrowserView;


const psNode = require("ps-node");

export interface PIDInfo
{
    pid : number;
    ppid : number;
    command : string;
    arguments : Array<string>;
    isPHAT : boolean;
    url : string;
}

export async function getPIDInfo(pid : number) : Promise<Array<PIDInfo>>
{
    let res = new Array<PIDInfo>();
    return new Promise<Array<PIDInfo>>((resolve,reject) => {
        psNode.lookup({pid : pid},function(err : Error,resultList : Array<any>){
            if(err)
                reject(err);
            for(let i = 0; i != resultList.length; ++i)
            {
                res.push(<PIDInfo>{
                    pid : resultList[i].pid,
                    ppid : resultList[i].ppid,
                    command : resultList[i].command,
                    arguments : resultList[i].arguments
                });
            }
            resolve(res);
        });
    }); 
}