const fs = require("fs");
const cp = require("child_process");
const path = require("path");

const ts = require("typescript");
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
if(!arg.buildCmd || !fs.existsSync(arg.buildCmd))
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
        let job = cp.execFile(`${arg.buildCmd}`,[file],{},(error : Error, stdout : string, stderr : string) => {
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

if(fs.existsSync(".buildCache/oldBuild.json"))
{
    oldBuild = JSON.parse(fs.readFileSync(".buildCache/oldBuild.json").toString());
}


const tsconfig = JSON.parse(fs.readFileSync("tsconfig.json").toString());

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

for(let i = 0; i != currentBuild.entryPoints.length; ++i)
{
    let rebuildEntryPoint = false;

    const program = ts.createProgram([currentBuild.entryPoints[i]],tsconfig);
    const sources = program.getSourceFiles();

    for(let k = 0; k != sources.length; ++k)
    {
        if(!currentBuild.files[sources[k].fileName])
        {
            currentBuild.files[sources[k].fileName] = fs.statSync(sources[k].fileName).mtimeMs;
        }
        if(oldBuild && oldBuild.files[sources[k].fileName] != currentBuild.files[sources[k].fileName])
        {
            rebuildEntryPoint = true;
        }
    }

    if(rebuildEntryPoint)
    {
        changedTargets++;
        runningBuilds.push(build(getJSFileExtension(currentBuild.entryPoints[i])));
    }

    else if(mode == "debug")
    {
        if(!fs.existsSync(`.buildCache/debug/${path.parse(getJSFileExtension(currentBuild.entryPoints[i])).base}`))
        {
            runningBuilds.push(build(getJSFileExtension(currentBuild.entryPoints[i])));
            newlyBuiltTargets++;
        }
        else
        {
            upToDate++;
        }
    }

    else if(mode == "release")
    {
        if(!fs.existsSync(`.buildCache/release/${path.parse(getJSFileExtension(currentBuild.entryPoints[i])).base}`))
        {
            runningBuilds.push(build(getJSFileExtension(currentBuild.entryPoints[i])));
            newlyBuiltTargets++;
        }
        else
        {
            upToDate++;
        }
    }
}

console.log(`${changedTargets} changed targets`);
console.log(`${newlyBuiltTargets} newly built targets`);
console.log(`${upToDate} up-to-date targets`);

fs.writeFileSync(".buildCache/oldBuild.json",JSON.stringify(currentBuild,undefined,4));

Promise.all(runningBuilds);