console.log("Started GUI test for ref seq inputing");
import("./../req/main/main");

import {logMainProcessErrors} from "./req/logMainProcessErrors";
logMainProcessErrors();

import {openProjectsView} from "./req/projectSelection/openProjectsView";
import {openFirstProject} from "./req/projectSelection/openFirstProject";
import {openInputWindow} from "./req/input/openInputWindow";
import {openRefSeqTab} from "./req/input/openRefSeqTab";
import {inputHPV16Ref} from "./req/input/inputHPV16Ref";
import {indexRefs} from "./req/input/indexRefs";
import {indexSuccess} from "./req/input/indexSuccess";
import {closeToolBar} from "./req/closeToolBar";

async function runTest() : Promise<void>
{
    await openProjectsView();
    await openFirstProject();
    await openInputWindow();
    await openRefSeqTab();
    await inputHPV16Ref();
    await indexRefs();
    await indexSuccess();
    await closeToolBar();
}
setTimeout(function(){
    runTest();
},1000);
