import * as fs from "fs";
import * as cp from "child_process";
import * as path from "path";
import * as readline from "readline";

import * as ts from "typescript";

const arg = require("minimist")(process.argv.slice(2));

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
    let res = fileName.replace(/\.ts/,`.js`);
    res = res.replace(/\.jsx/,`.js`);
    return res;
}

function build(file : string) : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        let job = cp.exec(`${arg.buildCmd} ${file}`,{},(error : Error, stdout : string, stderr : string) => {
            if(error)
            {
                console.log(error);
                process.exit(1);
            }
            if(stdout)
                console.log(stdout);
            if(stderr)
            {
                console.log(stderr);
                process.exit(1);
            }
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


//const tsconfig = JSON.parse(fs.readFileSync("tsconfig.json").toString());
const tsconfig = {
    jsx : ts.JsxEmit.React
} as ts.CompilerOptions;

let currentBuild : BuildState = <any>{};

currentBuild.entryPoints = arg._;
currentBuild.files = {};


let changedTargets = 0;
let newlyBuiltTargets = 0;
let upToDate = 0;

if(mode == "debug")
    console.log(`${currentBuild.entryPoints.length} Debug Targets`);
if(mode == "release")
    console.log(`${currentBuild.entryPoints.length} Release Targets`);

function updateProgress() : void
{
    readline.clearLine(process.stdout,0);
    readline.cursorTo(process.stdout,0,null);
    process.stdout.write(`${changedTargets} changed targets, ${upToDate} up-to-date targets, ${newlyBuiltTargets} newly built targets`);
}

for(let i = 0; i != currentBuild.entryPoints.length; ++i)
{
    let rebuildEntryPoint = false;

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

Promise.all(runningBuilds);

process.stdout.write("\n");