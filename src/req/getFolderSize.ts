import * as fs from "fs";
import * as path from "path";

//adapted from http://procbits.com/2011/10/29/a-node-js-experiment-thinking-asynchronously-recursion-calculate-file-size-directory
export function getFolderSize(dir : string) : number
{
    let size = 0;
    let stat : fs.Stats = fs.lstatSync(dir);
    if(stat.isFile())
        size += stat.size;
    else if(stat.isDirectory())
    {
        let files : Array<string> = fs.readdirSync(dir);
        for(let i = 0; i != files.length; ++i)
        {
            size += getFolderSize(path.join(dir,files[i]));
        }
    }
    return size;
}