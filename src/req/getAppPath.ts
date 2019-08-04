import * as fs from "fs";
import * as path from "path";

import {getEdition} from "./getEdition";

let readableBasePath : string | undefined = undefined;
let writableBasePath : string | undefined = undefined;
let readableAndWritableBasePath : string | undefined = undefined;

let isPortable = /(portable)/i;

/**
 * Sets readable base path
 *
 * @export
 * @param {string} path - Path
 */
export function setReadableBasePath(path : string)
{
    readableBasePath = path;
    console.log(`Readable base path set to: ${path}`);
} 

/**
 * Sets writable base path
 *
 * @export
 * @param {string} path - Path
 */
export function setWritableBasePath(path : string)
{
    writableBasePath = path;
    console.log(`Writable base path set to: ${path}`);
}

/**
 * Sets readable and writable base path
 *
 * @export
 * @param {string} path - Path
 */
export function setReadableAndWritableBasePath(path : string)
{
    readableAndWritableBasePath = path;
    console.log(`Readable and writable base path set to: ${path}`);
}

/**
 * Returns configuration directory on Linux
 *
 * @returns {string}
 */
function getLinuxConfigDir() : string | undefined
{
    if(process.env.HOME)
    {
        return process.env.HOME+"/.config/phat";
    }
    return undefined;
}

/**
 * Returns configuration directory on Windows
 *
 * @returns {string}
 */
function getWin32ConfigDir() : string | undefined
{
    if(process.env.APPDATA)
    {
        return process.env.APPDATA+"/phat";
    }
    return undefined;
}

/**
 * Returns readable directory
 *
 * @returns {string}
 */
function getReadableDir() : string | undefined
{
    let electronBaseDir = "";
    let CIBaseDir = "";
    let devBasedir = "";

    electronBaseDir = path.dirname(process.execPath)+"/resources/app";

    if(fs.existsSync(electronBaseDir))
        return electronBaseDir;

    CIBaseDir = process.cwd()+"/resources/app";

    if(fs.existsSync(CIBaseDir))
        return CIBaseDir;
    
    devBasedir = path.resolve(path.normalize(""));

    if(fs.existsSync(devBasedir))
        return devBasedir;
    
    return undefined;
}

/**
 * Returns configuration directory
 *
 * @returns {string}
 */
function getConfigDir() : string | undefined
{
    if(process.platform == "linux")
        return getLinuxConfigDir();
    else if(process.platform == "win32")
        return getWin32ConfigDir();
    return undefined;
}

/**
 * Returns fully qualified path to readable directory for relative path
 *
 * @export
 * @param {string} relativePath - Relative path
 * @returns {string}
 */
export function getReadable(relativePath : string) : string
{
    if(!readableBasePath)
    {
        setReadableBasePath(getReadableDir()!);
        return path.resolve(path.normalize(readableBasePath+"/"+relativePath));
    }
    return path.resolve(path.normalize(readableBasePath+"/"+relativePath));
}

/**
 * Returns fully qualified path to writable directory for relative path
 *
 * @export
 * @param {string} relativePath - Relative path
 * @returns {string}
 */
export function getWritable(relativePath : string) : string
{
    if(isPortable.test(getEdition()))
        return getReadable(relativePath);
    if(!writableBasePath)
    {
        setWritableBasePath(getConfigDir()!);
        return path.resolve(path.normalize(writableBasePath+"/"+relativePath));
    }
    return path.resolve(path.normalize(writableBasePath+"/"+relativePath));
}

/**
 * Returns fully qualified path to readable and writable directory for relative path
 *
 * @export
 * @param {string} relativePath - Relative path
 * @returns {string}
 */
export function getReadableAndWritable(relativePath : string) : string
{
    return getWritable(relativePath);
}
