console.log("Started GUI test for fastq inputting");
import("./../req/main/main");

import {logMainProcessErrors} from "./req/logMainProcessErrors";
logMainProcessErrors();

import {openProjectsView} from "./req/projectSelection/openProjectsView";
import {openFirstProject} from "./req/projectSelection/openFirstProject";
import {openInputWindow} from "./req/input/openInputWindow";
import {inputL6R1Reads} from "./req/input/inputL6R1Reads";
import {closeToolBar} from "./req/closeToolBar";

async function runTest() : Promise<void>
{
    await openProjectsView();
    await openFirstProject();
    await openInputWindow();
    await inputL6R1Reads();
    await closeToolBar();
}
setTimeout(function(){
    runTest();
},1000);