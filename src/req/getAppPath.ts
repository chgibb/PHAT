import * as fs from "fs";
import * as path from "path";

import {getEdition} from "./getEdition";

let readableBasePath : string = undefined;
let writableBasePath : string = undefined;
let readableAndWritableBasePath : string = undefined;

let isPortable = /(portable)/i;

export function setReadableBasePath(path : string)
{
    readableBasePath = path;
    console.log(`Readable base path set to: ${path}`);
} 
export function setWritableBasePath(path : string)
{
    writableBasePath = path;
    console.log(`Writable base path set to: ${path}`);
}
export function setReadableAndWritableBasePath(path : string)
{
    readableAndWritableBasePath = path;
    console.log(`Readable and writable base path set to: ${path}`);
}

function getLinuxConfigDir() : string
{
    if(process.env.HOME)
    {
        return process.env.HOME+"/.config/phat";
    }
    return undefined;
}

function getWin32ConfigDir() : string
{
    if(process.env.APPDATA)
    {
        return process.env.APPDATA+"/phat";
    }
    return undefined;
}
function getReadableDir() : string
{
    let electronBaseDir = "";
    let CIBaseDir = "";
    electronBaseDir = path.dirname(process.execPath)+"/resources/app";

    if(fs.existsSync(electronBaseDir))
        return electronBaseDir;

    CIBaseDir = process.cwd()+"/resources/app";

    if(fs.existsSync(CIBaseDir))
        return CIBaseDir;
    
    return undefined;
}

function getConfigDir() : string
{
    if(process.platform == "linux")
        return getLinuxConfigDir();
    else if(process.platform == "win32")
        return getWin32ConfigDir();
    return undefined;
}

export function getReadable(relativePath : string) : string
{
    if(!readableBasePath)
    {
        setReadableBasePath(getReadableDir());
        return path.resolve(path.normalize(readableBasePath+"/"+relativePath));
    }
    return path.resolve(path.normalize(readableBasePath+"/"+relativePath));
}

export function getWritable(relativePath : string) : string
{
    if(isPortable.test(getEdition()))
        return getReadable(relativePath);
    if(!writableBasePath)
    {
        setWritableBasePath(getConfigDir());
        return path.resolve(path.normalize(writableBasePath+"/"+relativePath));
    }
    return path.resolve(path.normalize(writableBasePath+"/"+relativePath));
}

export function getReadableAndWritable(relativePath : string) : string
{
    return getWritable(relativePath);
}
