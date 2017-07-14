import * as fs from "fs";
import * as readline from "readline";

import {getReadableAndWritable} from "./../../getAppPath";
import {LogRecord} from "./../../operations/atomicOperations";

export async function streamLogToNode(logRecord : LogRecord,node : HTMLElement) : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        let rl : readline.ReadLine = readline.createInterface(
            <readline.ReadLineOptions>{
                input : fs.createReadStream(
                    getReadableAndWritable(`logs/${logRecord.uuid}/log`)
                )
            }
        );

        rl.on("line",function(line : string){
            node.innerHTML += `<pre>${line}</pre>`;
        });
        
        rl.on("close",function(){
            resolve();
        });

    });
}