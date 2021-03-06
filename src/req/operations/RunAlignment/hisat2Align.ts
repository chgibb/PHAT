import * as fs from "fs";

import * as atomic from "./../atomicOperations";
import {AlignData,getArtifactDir,getCoverageDir,getSam} from "./../../alignData";
import {getReadable,getReadableAndWritable} from "./../../getAppPath";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";
import {getPath} from "./../../file";

/**
 * Produce an unsorted sam from aligning alignData's fastqs against its fasta
 * 
 * @export
 * @param {AlignData} alignData 
 * @param {atomic.AtomicOperation} logger 
 * @returns {Promise<void>} 
 */
export function hisat2Align(alignData : AlignData,logger : atomic.AtomicOperation<any>) : Promise<void>
{
    return new Promise<void>((
        resolve : (value? : void) => void,
        reject : (reason : any) => void
    ) => 
    {
        let hisat2Exe = "";
        if(process.platform == "linux")
            hisat2Exe = getReadable("hisat2");
        else if(process.platform == "win32")
            hisat2Exe = getReadable("hisat2-align-s.exe");  

        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                logger.logObject(params);
                if(params.processName == hisat2Exe)
                {
                    if(params.unBufferedData)
                        alignData.summaryText += params.unBufferedData;
                    if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            setTimeout(function()
                            {
                                return resolve();
                            },2000);
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
            
        args.push("-x");
        if(process.platform == "linux")
            args.push("\""+getReadableAndWritable(`rt/indexes/${alignData.fasta!.uuid}`)+"\"");
        else if(process.platform == "win32")
            args.push(getReadableAndWritable(`rt/indexes/${alignData.fasta!.uuid}`));
        if(alignData.fastqs[1])
        {
            args.push("-1");
            //hisat2 cannot handle spaces in fastq paths unless they're quoted but bowtie2 can for some reason
            if(process.platform == "linux")
            {
                args.push("\""+getPath(alignData.fastqs[0])+"\"");
                args.push("-2");
                args.push("\""+getPath(alignData.fastqs[1])+"\"");
            }
            else if(process.platform == "win32")
            {
                args.push(getPath(alignData.fastqs[0]));
                args.push("-2");
                args.push(getPath(alignData.fastqs[1]));
            }
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
            alignData.alias = `${alignData.fastqs[0].alias}, ${alignData.fastqs[1].alias}; ${alignData.fasta!.alias}`;
        else
            alignData.alias = `${alignData.fastqs[0].alias}; ${alignData.fasta!.alias}`;
        fs.mkdirSync(getArtifactDir(alignData));
        let hisatJob = new Job(hisat2Exe,args,"",true,jobCallBack,{});
        try
        {
            hisatJob.Run();
            logger.addPIDFromFork(hisatJob.pid!);
        }
        catch(err)
        {
            return reject(err);
        }
    });
}