import * as fs from "fs";
import * as cp from "child_process";
import * as path from "path";
import * as readline from "readline";

import * as ts from "typescript";

const arg = require("minimist")(process.argv.slice(2));

import {buildSymbolList,MangledSymbol} from "./mangleSymbols";
import {mangleSymbolsInFile} from "./mangleSymbolsInFile";

let mode : "debug" | "release";
let mangleSymbols = false;

if(!fs.existsSync(".buildCache"))
{
    fs.mkdirSync(".buildCache");
}

if(!fs.existsSync(".buildCache/debug"))
{
    fs.mkdirSync(".buildCache/debug");
}

if(!fs.existsSync(".buildCache/release"))
{
    fs.mkdirSync(".buildCache/release");
}

if(arg.debug)
    mode = "debug";
if(arg.release)
    mode = "release";

if(arg.mangleSymbols)
    mangleSymbols = true;

if(!mode)
{
    console.error("No build mode given");
    process.exit(1);
}
if(!arg.buildCmd)
{
    console.error("No build command given");
    process.exit(1);
}

interface BuildState
{
    entryPoints : Array<string>;
    files : {[key : string] : string};
    symbolsToMangle : Array<MangledSymbol>;
}

function getJSFileExtension(fileName : string) : string
{
    return fileName.replace(/\.ts/,`.js`);
}

function build(file : string) : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        let job = cp.exec(`${arg.buildCmd} ${file}`,{},(error : Error, stdout : string, stderr : string) => {
            if(error)
            {
                return reject(error);
            }
            if(stdout)
                console.log(stdout);
            if(stderr)
                console.log(stderr);
        });
        return resolve();
    }); 
}

let runningBuilds = new Array<Promise<void>>();

let oldBuild : BuildState;

if(mode == "debug" && fs.existsSync(".buildCache/debug/oldBuild.json"))
{
    oldBuild = JSON.parse(fs.readFileSync(".buildCache/debug/oldBuild.json").toString());
}

else if(mode == "release" && fs.existsSync(".buildCache/release/oldBuild.json"))
{
    oldBuild = JSON.parse(fs.readFileSync(".buildCache/release/oldBuild.json").toString());
}


const tsconfig = JSON.parse(fs.readFileSync("tsconfig.json").toString());

let currentBuild : BuildState = <any>{};

currentBuild.entryPoints = arg._;
currentBuild.files = {};
currentBuild.symbolsToMangle = new Array<MangledSymbol>();


let changedTargets = 0;
let newlyBuiltTargets = 0;
let upToDate = 0;

let mangledSymbols = 0;

if(mode == "debug")
    console.log(`${currentBuild.entryPoints.length} Debug Targets`);
if(mode == "release")
    console.log(`${currentBuild.entryPoints.length} Release Targets`);

function updateProgress() : void
{
    readline.clearLine(process.stdout,0);
    readline.cursorTo(process.stdout,0,null);
    process.stdout.write(`${changedTargets} changed targets, ${upToDate} up-to-date targets, ${newlyBuiltTargets} newly built targets. ${currentBuild.symbolsToMangle.length} symbols with mangleable linkage, ${mangledSymbols} mangled references`);
}

function gatherSymbolsToMangle() : Promise<void>
{
    return new Promise<void>(async (resolve : () => void) => {
        for(let i = 0; i != currentBuild.entryPoints.length; ++i)
        {
            updateProgress();
            const sources = ts.createProgram([currentBuild.entryPoints[i]],tsconfig).getSourceFiles();
            updateProgress();
            for(let k = 0; k != sources.length; ++k)
            {
                await buildSymbolList(sources[k],currentBuild.symbolsToMangle);
                updateProgress();
            }
        }
        return resolve();
    });
}

function mangleReferences(symbolsToMangle : Array<MangledSymbol>) : Promise<void>
{
    return new Promise<void>(async (resolve : () => void) => {
        for(let i = 0; i != currentBuild.entryPoints.length; ++i)
        {
            updateProgress();
            const sources = ts.createProgram([currentBuild.entryPoints[i]],tsconfig).getSourceFiles();
            for(let k = 0; k != sources.length; ++k)
            {
                if(fs.existsSync(getJSFileExtension(sources[k].fileName)))
                {
                    let res = await mangleSymbolsInFile(fs.readFileSync(getJSFileExtension(sources[k].fileName)).toString(),symbolsToMangle);
                    fs.writeFileSync(getJSFileExtension(sources[k].fileName),res.res);
                    mangledSymbols += res.num;
                    updateProgress();
                }
            }
        }
        return resolve();
    });
}

(async function(){
    if(mangleSymbols)
    {
        await gatherSymbolsToMangle();
        await mangleReferences(currentBuild.symbolsToMangle);
    }

    let newSymbols = false;
    
    if(!oldBuild.symbolsToMangle && currentBuild.symbolsToMangle)
        newSymbols = true;
    else if(oldBuild.symbolsToMangle && currentBuild.symbolsToMangle && oldBuild.symbolsToMangle.length != currentBuild.symbolsToMangle.length)
        newSymbols = true;
        
    for(let i = 0; i != currentBuild.entryPoints.length; ++i)
    {
        let rebuildEntryPoint = false;
        if(newSymbols)
            rebuildEntryPoint = true;

        const program = ts.createProgram([currentBuild.entryPoints[i]],tsconfig);
        const sources = program.getSourceFiles();

        for(let k = 0; k != sources.length; ++k)
        {
            //only stat each file once
            if(!currentBuild.files[sources[k].fileName])
            {
                currentBuild.files[sources[k].fileName] = fs.statSync(sources[k].fileName).mtime.toString();
            }

            //file has been modified since the last build
            if(oldBuild && oldBuild.files[sources[k].fileName] != currentBuild.files[sources[k].fileName])
            {
                rebuildEntryPoint = true;
            }
        }

        //one or more source files comprising entryPoints[i] have been modified since the last build
        if(rebuildEntryPoint)
        {
            changedTargets++;
            runningBuilds.push(build(getJSFileExtension(currentBuild.entryPoints[i])));
            updateProgress();
        }

        else if(mode == "debug")
        {
            //nothing has changed since last build, but there is also no cached build
            if(!fs.existsSync(`.buildCache/debug/${path.parse(getJSFileExtension(currentBuild.entryPoints[i])).base}`))
            {
                runningBuilds.push(build(getJSFileExtension(currentBuild.entryPoints[i])));
                newlyBuiltTargets++;
                updateProgress();
            }
            else
            {
                upToDate++;
                updateProgress();
            }
        }

        else if(mode == "release")
        {
            if(!fs.existsSync(`.buildCache/release/${path.parse(getJSFileExtension(currentBuild.entryPoints[i])).base}`))
            {
                runningBuilds.push(build(getJSFileExtension(currentBuild.entryPoints[i])));
                newlyBuiltTargets++;
                updateProgress();
            }
            else
            {
                upToDate++;
                updateProgress();
            }
        }
    }

    if(mode == "debug")
        fs.writeFileSync(".buildCache/debug/oldBuild.json",JSON.stringify(currentBuild,undefined,4));
    else if(mode == "release")
        fs.writeFileSync(".buildCache/release/oldBuild.json",JSON.stringify(currentBuild,undefined,4));

    await Promise.all(runningBuilds);

    process.stdout.write("\n");
})().catch((err) => {
    console.log(err);
});