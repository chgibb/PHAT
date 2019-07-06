import * as fs from "fs";
import * as readline from "readline";

import {getReadableAndWritable} from "./../../getAppPath";
import {LogRecord} from "./../../operations/atomicOperations";

function scanForError(line : string) : boolean
{
    let hasRetCode = /retCode/;
    let hasError = /error/i;
    let hasException = /exception/i;
    let hasCrashed = /crashed/i;
    let hasNo = /no/i;

    if(hasError.test(line))
        return true;
    if(hasException.test(line))
        return true;
    if(hasCrashed.test(line))
        return true;
    if(hasNo.test(line))
        return true;
    return false;
}

export async function streamLogToNode(logRecord : LogRecord,node : HTMLElement) : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        let rl : readline.ReadLine = readline.createInterface(
            <readline.ReadLineOptions>{
                input : fs.createReadStream(
                    getReadableAndWritable(`logs/${logRecord.uuid}/log`)
                )
            }
        );

        rl.on("line",function(line : string)
        {
            if(logRecord.status != "failure")
                node.innerHTML += `<pre>${line}</pre>`;
            else
            {
                if(scanForError(line))
                {
                    node.innerHTML += `<pre><span style="color:red;font-size:x-large;"><b>${line}</b></span></pre>`;
                }
                else
                    node.innerHTML += `<pre>${line}</pre>`;
            }
        });
        
        rl.on("close",function()
        {
            resolve();
        });

    });
}