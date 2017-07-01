import * as fs from "fs";

import * as atomic from "./../atomicOperations";
import {alignData,getArtifactDir,getCoverageDir,getSam} from "./../../alignData";
import {getReadable,getReadableAndWritable} from "./../../getAppPath";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";
import {getPath} from "./../../file";

export function bowTie2Align(alignData : alignData,logger : atomic.AtomicOperation) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let bowtie2Exe = "";
        if(process.platform == "linux")
            bowtie2Exe = getReadable('bowtie2');
        else if(process.platform == "win32")
            bowtie2Exe = getReadable('perl/perl/bin/perl.exe');

        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                logger.logObject(params);
                if(params.processName == bowtie2Exe)
                {
                    if(params.unBufferedData)
                        alignData.summaryText += params.unBufferedData;
                    if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            return resolve();
                        }
                        else
                        {
                            return reject(params.unBufferedData);
                        }
                    }
                }
            }
        };
        

        let args : Array<string> = new Array<string>();

        if(process.platform == "win32")
            args.push(getReadable("bowtie2"));
        args.push("-x");
        args.push("\""+getReadableAndWritable(`rt/indexes/${alignData.fasta.uuid}`)+"\"");
        if(alignData.fastqs[1] !== undefined)
        {
            args.push("-1");
            args.push(getPath(alignData.fastqs[0]));
            args.push("-2");
            args.push(getPath(alignData.fastqs[1]));
        }
        else
        {
            args.push("-U");
            args.push(getPath(alignData.fastqs[0]));
        }
        args.push("-S");
        args.push(getSam(alignData));

        let invokeString = "";
        for(let i = 0; i != args.length; ++i)
        {
            invokeString += args[i];
            invokeString += " ";
        }
        alignData.invokeString = invokeString;
        if(alignData.fastqs[1] !== undefined)
            alignData.alias = `${alignData.fastqs[0].alias}, ${alignData.fastqs[1].alias}; ${alignData.fasta.alias}`;
        else
            alignData.alias = `${alignData.fastqs[0].alias}; ${alignData.fasta.alias}`;
        fs.mkdirSync(getArtifactDir(alignData));
        fs.mkdirSync(getCoverageDir(alignData));
        let bowtieJob = new Job(bowtie2Exe,args,"",true,jobCallBack,{});
        try
        {
            bowtieJob.Run();
        }
        catch(err)
        {
            return reject(err);
        }
    });
}