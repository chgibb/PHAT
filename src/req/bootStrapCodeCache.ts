/// <reference types="node" />

import * as vm from "vm";
import * as fs from "fs";

/*
	This is probably not okay.
	It however ensures that this module will function correctly if invoked to bootstrap some other
	script transitively. I.e. node bootStrapper -> actualScript
	where bootStrapper simply calls require("bootStrapCodeCache")("actualScript",etc)
	vm.runInThisContext does NOT expose local variables/enclosing params. This actually binds 
	the require param (from Node's module.wrapper) to the global scope of jsFile. This will probably blow up in my face
	at some point. require is passed along just fine under Electron(in renderer mode) if this module is invoked from within <script> tags in html.
	This leads me to believe Electron(in renderer mode) is therefore binding Node's real, global require to the process' global at startup.
	This fix is only required when run under Node. Maybe an environment check should be made prior to actually doing this. 
*/
if(!(<any>global).require)
    (<any>global).require = require;

/**
 * Load the cached data at cdata, using the js source file at jsFile as the reference source.
 * Returns 0 on success.
 * Returns 1 if the cached data at cdata does not exist.
 * Returns 2 if the js source file at jsFile does not exist.
 * Returns 3 if the cached data was rejected by V8.
 * 
 * @param {string} jsFile 
 * @param {string} cdata 
 * @returns {number} 
 */
function loadFromCache(jsFile : string,cdata : string) : number
{
    let cache : Buffer;
    let jsFileCode : string;
    try
    {
        cache = fs.readFileSync(cdata);
    }
    catch(err)
    {
        console.log("Could not load "+cdata);
        return 1;
    }
    try
    {
        jsFileCode = (<any>fs.readFileSync(jsFile));
    }
    catch(err)
    {
        console.log("Could not load "+jsFile+" fatal");
        return 2;
    }
    let compiledCode : vm.Script = new vm.Script(
        jsFileCode,<vm.ScriptOptions>{
            filename : jsFile,
            lineOffset : 0,
            displayErrors : true,
            cachedData : cache
        }
    );
    if(!(<any>compiledCode).cachedDataRejected)
    {
        console.log("Successfully loaded from "+cdata);
        compiledCode.runInThisContext();
        return 0;
    }
    else
    {
        console.log("Cached code "+cdata+" was rejected.");
        return 3;
    }
}

/**
 * Compile cached data for the js source file at jsFile, saves to the path given by cdata.
 * Returns 0 on success.
 * Returns 1 if the js source file at jsFile failed to compile.
 * Returns 2 if the js source file at jsFile does not exist.
 * Returns 3 if the compiled cached data for the js source file at jsFile could not be written to the path given by cdata.
 * 
 * @param {string} jsFile 
 * @param {string} cdata 
 * @returns {number} 
 */
function compileCache(jsFile : string,cdata : string) : number
{
    let jsFileCode : string;
    let cache : Buffer;
    let compiler : vm.Script;
    try
    {
        jsFileCode = (<any>fs.readFileSync(jsFile));
    }
    catch(err)
    {
        console.log("Could not load "+jsFile+" fatal");
        return 2;
    }
    compiler = new vm.Script(
        jsFileCode,<vm.ScriptOptions>{
            filename : jsFile,
            lineOffset : 0,
            displayErrors : true,
            produceCachedData : true
        }
    );
    if((<any>compiler).cachedDataProduced && (<any>compiler).cachedData)
    {
        cache = (<any>compiler).cachedData;
        console.log("Successfully compiled "+jsFile);
        try
        {
            fs.writeFileSync(cdata,cache);
        }
        catch(err)
        {
            console.log("Failed to write "+cdata);
            return 3;
        }
        return 0;
    }
    else
    {
        console.log("Failed to compile "+jsFile);
        return 1;
    }
}

/**
 * Bootstraps a code cache for the js source file at jsFile.
 * Trys to first load the cached data at cdata using the js source file at jsFile as the reference source.
 * On failure, will try to compile the js source at jsFile, save it to cdata and then load it.
 * On failure to compile, failure to write or failure to load compiled cached data, will fall back to requiring jsModule.
 * 
 * @export
 * @param {string} jsFile 
 * @param {string} jsModule 
 * @param {string} cdata 
 * @returns {void} 
 */
export function bootStrapCodeCache(jsFile : string,jsModule : string,cdata : string) : void
{
    if("production" !== process.env.NODE_ENV)
    {
        require(`./../${jsModule}`);
        return;
    }
    let cacheStatus : number = loadFromCache(jsFile,cdata);
    //cdata exists, is valid and has been executed
    if(cacheStatus == 0)
        return;
    //either the cache does not exist, or is invalid for some reason
    if(cacheStatus == 1 || cacheStatus == 3)
    {
        //try to compile a new cache
        let compilerStatus = compileCache(jsFile,cdata);
        //try to load the new cache
        let secondTry = loadFromCache(jsFile,cdata);
        //if there was a failure in either operation then stop trying and just
        //load the JS the old fashioned way
        if(secondTry != 0 || compilerStatus != 0)
        {
            console.log("Falling back to require");
            require(jsModule);
            return;
        }
    }
    //the file specified by jsFile does not exist. This is fatal and will break all other operations. 
    if(cacheStatus == 2)
    {
        throw new Error("Fatal error: Could not load file "+jsFile);
    }
}
