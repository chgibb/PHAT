/// <reference types="electron" />

let app : Electron.App = null;

import {getEdition,setEditionSource} from "./getEdition";
let readableBasePath = ""
let writableBasePath = "";
let readableAndWritableBasePath = "";
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
    return undefined;
}

function getConfigDir() : string
{
    if(process.platform == "linux")
        return getLinuxConfigDir();
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
        if(!getElectronApp())
            throw new Error("No readable base path set");
        else
            setReadableBasePath(app.getAppPath());
    }
    return readableBasePath+"/"+relativePath;
}

export function getWritable(relativePath : string) : string
{
    if(!writableBasePath)
    {
        if(!getElectronApp())
        {
            let configDir = getConfigDir();
            if(configDir)
            {
                setWritableBasePath(configDir);
                return writableBasePath+"/"+relativePath;
            }
            else
                throw new Error("No readable base path set");
        }
        else
            setWritableBasePath(app.getPath("userData"));
    }
    return writableBasePath+"/"+relativePath;
}

export function getReadableAndWritable(relativePath : string) : string
{
    if(!readableAndWritableBasePath)
    {
        if(!getElectronApp())
        {
            let configDir = getConfigDir();
            if(configDir)
            {
                setReadableAndWritableBasePath(configDir);
                return readableAndWritableBasePath+"/"+relativePath;
            }
            else
                throw new Error("No readable/writable base path set");
        }
        else
            setReadableAndWritableBasePath(app.getPath("userData"));
    }
    return readableAndWritableBasePath+"/"+relativePath;
}
