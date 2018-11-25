import * as fs from "fs";

import * as atomic from "../atomicOperations";
import {AlignData,getArtifactDir,getCoverageDir,getSam} from "../../alignData";
import {getReadable,getReadableAndWritable} from "../../getAppPath";
import {SpawnRequestParams} from "../../JobIPC";
import {Job,JobCallBackObject} from "../../main/Job";
import {getPath} from "../../file";

/**
 * Produce an unsorted sam from aligning alignData's fastqs against its fasta
 * 
 * @export
 * @param {AlignData} alignData 
 * @param {atomic.AtomicOperation} logger 
 * @returns {Promise<void>} 
 */
export function bowtie2Align(alignData : AlignData,logger : atomic.AtomicOperation) : Promise<void>
{
    return new Promise<void>((
        resolve : (value? : void) => void,
        reject : (reason : any) => void
    ) => {
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
        args.push("--sensitive-local");
        args.push("-x");
        args.push("\""+getReadableAndWritable(`rt/indexes/${alignData.fasta.uuid}`)+"\"");
        if(alignData.fastqs[1])
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
        if(alignData.fastqs[1])
            alignData.alias = `${alignData.fastqs[0].alias}, ${alignData.fastqs[1].alias}; ${alignData.fasta.alias}`;
        else
            alignData.alias = `${alignData.fastqs[0].alias}; ${alignData.fasta.alias}`;
        fs.mkdirSync(getArtifactDir(alignData));
        let bowtieJob = new Job(bowtie2Exe,args,"",true,jobCallBack,{});
        try
        {
            bowtieJob.Run();
            logger.addPIDFromFork(bowtieJob.pid);
        }
        catch(err)
        {
            return reject(err);
        }
    });
}