console.log("Started GUI test for read aligning");
require("./../req/main/main");
import {logMainProcessErrors} from "./req/logMainProcessErrors";
logMainProcessErrors();
import {openProjectsView} from "./req/projectSelection/openProjectsView";
import {openFirstProject} from "./req/projectSelection/openFirstProject";
import {openAlignWindow} from "./req/align/openAlignWindow";
import {clickSecondAndThirdInputs} from "./req/align/clickSecondAndThirdInputs";
import {alignSuccess} from "./req/align/alignSuccess";
import {closeToolBar} from "./req/closeToolBar";
import { clickAdvanceZero } from './req/align/clickAdvanceZero';
import { clickAdvanceOne } from './req/align/clickAdvanceOne';
import { clickFourthInput } from './req/align/clickFourthInput';
import { clickAdvanceTwo } from './req/align/clickAdvanceTwo';
import { clickAdvanceThree } from './req/align/clickAdvanceThree';
import { clickBowtie2Radio } from './req/align/clickBowtie2Radio';
import { clickStartAlign } from './req/align/clickStartAlign';

async function runTest() : Promise<void>
{
    await openProjectsView();
    await openFirstProject();
    await openAlignWindow();
    await clickAdvanceZero();
    await clickSecondAndThirdInputs();
    await clickAdvanceZero();
    await clickAdvanceOne();
    await clickAdvanceTwo();
    await clickFourthInput();
    await clickAdvanceTwo();
    await clickAdvanceThree();
    await clickBowtie2Radio();
    await clickAdvanceThree();
    await clickStartAlign();
    await alignSuccess();
    await closeToolBar();
}
setTimeout(function()
{
    runTest();
},1000);