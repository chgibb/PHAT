import * as electron from "electron";
const BrowserWindow = electron.remote.BrowserWindow;

import {PIDInfo} from "./PIDInfo";

/**
 * Returns CPU % and RAM use (in bytes) for the specified pid
 * 
 * @export
 * @param {number} pid 
 * @returns {Promise<{cpu : number,memory : number}>} 
 */
export async function getPIDUsage(pid : number) : Promise<{cpu : number,memory : number}>
{
    const pidUsage = require("pidusage");
    
    return new Promise<{cpu : number,memory : number}>((resolve,reject) => 
    {
        pidUsage.stat(pid,function(err : Error,stat : any)
        {
            if(err)
                reject(err);
            pidUsage.unmonitor(pid);
            //sometimes the process has already closed by the time we get a reply from main about pids being used
            //this access will throw if the process we're tring to get usage for has already exited
            try
            {
                resolve({cpu : stat.cpu,memory : stat.memory});
            }
            catch(err)
            {
                reject(err);
            }
        });
    });
}

/**
 * Returns PIDInfo results for the specified pid detailing pid, ppid, command and args
 * 
 * @export
 * @param {number} pid 
 * @returns {Promise<Array<PIDInfo>>} 
 */
export async function getPIDInfo(pid : number) : Promise<Array<PIDInfo>>
{
    const psNode = require("ps-node");

    let res = new Array<PIDInfo>();
    return new Promise<Array<PIDInfo>>((resolve,reject) => 
    {
        psNode.lookup({pid : pid},function(err : Error,resultList : Array<any>)
        {
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