console.log("Started GUI test for ref seq inputing");
require("./../req/main/main");
import {logMainProcessErrors} from "./req/logMainProcessErrors";
logMainProcessErrors();
import {openProjectsView} from "./req/projectSelection/openProjectsView";
import {openFirstProject} from "./req/projectSelection/openFirstProject";
import {openInputWindow} from "./req/input/openInputWindow";
import {openRefSeqTab} from "./req/input/openRefSeqTab";
import {inputHPV16Ref} from "./req/input/inputHPV16Ref";
import {closeToolBar} from "./req/closeToolBar";

async function runTest() : Promise<void>
{
    await openProjectsView();
    await openFirstProject();
    await openInputWindow();
    await openRefSeqTab();
    await inputHPV16Ref();
    await closeToolBar();
}
setTimeout(function()
{
    runTest();
},1000);
