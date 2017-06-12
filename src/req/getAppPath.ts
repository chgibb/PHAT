/// <reference types="electron" />

import * as path from "path";

let app : Electron.App = null;

import {getEdition} from "./getEdition";

let readableBasePath : string = undefined;
let writableBasePath : string = undefined;
let readableAndWritableBasePath : string = undefined;

let isPortable = /(portable)/i;

export function isRenderer() : boolean
{
    return (process && process.type == "renderer");
}

function getElectronApp() : boolean
{
    let electron = undefined;
    try
    {
        electron = require("electron");
        if(app)
            return true;
        //electron.app is undefined in renderer
        if(isRenderer())
        {
            app = electron.remote.app;
            return true;
        }
        else
        {
            app = electron.app;
            return true;
        }
    }
    //require("electron") throws module not found in Node
    catch(err)
    {
        return false;
    }
    
}

export function setReadableBasePath(path : string)
{
    readableBasePath = path;
} 
export function setWritableBasePath(path : string)
{
    writableBasePath = path;
}
export function setReadableAndWritableBasePath(path : string)
{
    readableAndWritableBasePath = path;
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
    //If we're running under Electron then execPath will be of the form:
    // /absolute/path/to/app-plat-xarch/app.exe
    //If we're running a forked process then process.versions["electron"] will be undefined
    if(process.versions["electron"] || !isPortable.test(getEdition()))
        return path.dirname(process.execPath)+"/resources/app";
    else
        return process.cwd()+"/resources/app";
}



function getConfigDir() : string
{
    if(process.platform == "linux")
        return getLinuxConfigDir();
    else if(process.platform == "win32")
        return getWin32ConfigDir();
    return undefined
}

/*
    Will try to detect Electron environment (main/renderer) and initialize base paths acoordingly if they
    have not yet been set for the current process. Will fail to initiliaze under Node and will throw an exception.
    Under Node, each paths setPath methods must be called before their corresponding get methods
*/
export function getReadable(relativePath : string) : string
{
    if(!readableBasePath)
    {
        setReadableBasePath(getReadableDir());
        return readableBasePath+"/"+relativePath;
    }
    return readableBasePath+"/"+relativePath;
}

export function getWritable(relativePath : string) : string
{
    if(isPortable.test(getEdition()))
        return getReadable(relativePath);
    if(!writableBasePath)
    {
        setWritableBasePath(getConfigDir());
        return writableBasePath+"/"+relativePath;
    }
    return writableBasePath+"/"+relativePath;
}

export function getReadableAndWritable(relativePath : string) : string
{
    return getWritable(relativePath);
}
