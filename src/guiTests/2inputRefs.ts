console.log("Started GUI test for ref seq inputing");
require("./../req/main/main");

import * as path from "path";

import * as winMgr from "./../req/main/winMgr";
import * as dataMgr from "./../req/main/dataMgr";
import * as atomicOp from "./../req/operations/atomicOperations";
import {IndexFasta} from "./../req/operations/indexFasta";

import {Fasta} from "./../req/fasta";

import {openProjectsView} from "./req/projectSelection/openProjectsView";
import {openFirstProject} from "./req/projectSelection/openFirstProject";
import {openInputWindow} from "./req/input/openInputWindow";
import {inputHPV16Ref} from "./req/input/inputHPV16Ref";
import {openRefSeqView} from "./req/input/openRefSeqView";
import {selectAllRefs} from "./req/input/selectAllRefs";
import {indexRefs} from "./req/input/indexRefs";
import {indexSuccess} from "./req/input/indexSuccess";
import {closeToolBar} from "./req/closeToolBar";

async function runTest() : Promise<void>
{
    await openProjectsView();
    await openFirstProject();

    await openInputWindow();
    await inputHPV16Ref();
    await openRefSeqView();
    await selectAllRefs();
    await indexRefs();
    await indexSuccess().then(async (val) => {
        if(val === true)
        {
            await closeToolBar();
        }
    });
}
setTimeout(function(){
    runTest();
},1000);
