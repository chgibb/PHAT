import * as fs from "fs";
import * as cp from "child_process";
import * as path from "path";
import * as readline from "readline";

import * as ts from "typescript";

const arg = require("minimist")(process.argv.slice(2));

import {buildSymbolList,symbolsToMangle} from "./mangleSymbols";
import {mangleSymbolsInFile} from "./mangleSymbolsInFile";

let mode : "debug" | "release";

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


let changedTargets = 0;
let newlyBuiltTargets = 0;
let upToDate = 0;

let mangledSymbols = 0;

if(mode == "debug")
    console.log(`${currentBuild.entryPoints.length} Debug Targets`);
if(mode == "release")
    console.log(`${currentBuild.entryPoints.length} Release Targets`);

function updateBuildProgress() : void
{
    readline.clearLine(process.stdout,0);
    readline.cursorTo(process.stdout,0,null);
    process.stdout.write(`${changedTargets} changed targets, ${upToDate} up-to-date targets, ${newlyBuiltTargets} newly built targets`);
}

function updateMangleProgress() : void
{
    readline.clearLine(process.stdout,0);
    readline.cursorTo(process.stdout,0,null);
    process.stdout.write(`${symbolsToMangle.length} symbols with mangleable linkage, ${mangledSymbols} mangled references`);
}

function gatherSymbolsToMangle() : Promise<void>
{
    return new Promise<void>(async (resolve : () => void) => {
        for(let i = 0; i != currentBuild.entryPoints.length; ++i)
        {
            updateMangleProgress();
            const sources = ts.createProgram([currentBuild.entryPoints[i]],tsconfig).getSourceFiles();
            updateMangleProgress();
            for(let k = 0; k != sources.length; ++k)
            {
                await buildSymbolList(sources[k]);
                updateMangleProgress();
            }
        }
        return resolve();
    });
}

function mangleReferences() : Promise<void>
{
    return new Promise<void>(async (resolve : () => void) => {
        for(let i = 0; i != currentBuild.entryPoints.length; ++i)
        {
            updateMangleProgress();
            const sources = ts.createProgram([currentBuild.entryPoints[i]],tsconfig).getSourceFiles();
            for(let k = 0; k != sources.length; ++k)
            {
                if(fs.existsSync(getJSFileExtension(sources[k].fileName)))
                {
                    let res = await mangleSymbolsInFile(fs.readFileSync(getJSFileExtension(sources[k].fileName)).toString());
                    fs.writeFileSync(getJSFileExtension(sources[k].fileName),res.res);
                    mangledSymbols += res.num;
                    updateMangleProgress();
                }
            }
        }
        return resolve();
    });
}

(async function(){
    await gatherSymbolsToMangle();
    await mangleReferences();
    console.log();
    //console.log(`${symbolsToMangle.length} mangleable symbols`);

    let newSymbols = false;

    let oldSymbols = new Array();
    if(fs.existsSync(".buildCache/symbolsToMangle.json"))
        oldSymbols = JSON.parse(fs.readFileSync(".buildCache/symbolsToMangle.json").toString());
    
    if(oldSymbols.length != symbolsToMangle.length)
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
            updateBuildProgress();
        }

        else if(mode == "debug")
        {
            //nothing has changed since last build, but there is also no cached build
            if(!fs.existsSync(`.buildCache/debug/${path.parse(getJSFileExtension(currentBuild.entryPoints[i])).base}`))
            {
                runningBuilds.push(build(getJSFileExtension(currentBuild.entryPoints[i])));
                newlyBuiltTargets++;
                updateBuildProgress();
            }
            else
            {
                upToDate++;
                updateBuildProgress();
            }
        }

        else if(mode == "release")
        {
            if(!fs.existsSync(`.buildCache/release/${path.parse(getJSFileExtension(currentBuild.entryPoints[i])).base}`))
            {
                runningBuilds.push(build(getJSFileExtension(currentBuild.entryPoints[i])));
                newlyBuiltTargets++;
                updateBuildProgress();
            }
            else
            {
                upToDate++;
                updateBuildProgress();
            }
        }
    }

    if(mode == "debug")
        fs.writeFileSync(".buildCache/debug/oldBuild.json",JSON.stringify(currentBuild,undefined,4));
    else if(mode == "release")
        fs.writeFileSync(".buildCache/release/oldBuild.json",JSON.stringify(currentBuild,undefined,4));

    await Promise.all(runningBuilds);

    fs.writeFileSync(".buildCache/symbolsToMangle.json",JSON.stringify(symbolsToMangle,undefined,4));

    process.stdout.write("\n");
})().catch((err) => {
    console.log(err);
});