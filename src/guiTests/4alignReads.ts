console.log("Started GUI test for read aligning");
require("./../req/main/main");

import {openProjectsView} from "./req/projectSelection/openProjectsView";
import {openFirstProject} from "./req/projectSelection/openFirstProject";
import {openAlignWindow} from "./req/align/openAlignWindow";
import {selectFirstTwoReads} from "./req/align/selectFirstTwoReads";
import {selectFirstRef} from "./req/align/selectFirstRef";
import {closeToolBar} from "./req/closeToolBar";

async function runTest() : Promise<void>
{
    await openProjectsView();
    await openFirstProject();
    await openAlignWindow();
    await selectFirstTwoReads();
    await selectFirstRef();
    await closeToolBar();
}
setTimeout(function(){
    runTest();
},1000);