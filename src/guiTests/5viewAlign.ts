console.log("Started GUI test for alignment viewing");
require("./../req/main/main");
import {logMainProcessErrors} from "./req/logMainProcessErrors";
logMainProcessErrors();
import {openProjectsView} from "./req/projectSelection/openProjectsView";
import {openFirstProject} from "./req/projectSelection/openFirstProject";
import {openOutputWindow} from "./req/output/openOutputWindow";
import {viewSNP} from "./req/output/viewSNP";
import {closeAllPileupWindows} from "./req/pileup/closeAllPileupWindows";
import {closeToolBar} from "./req/closeToolBar";
import {openViewMoreDialogForFirstAlignment} from "./req/output/openViewMoreDialogForFirstAlignment";
import {clickPredictedSNPsButton} from "./req/output/clickPredictedSNPsButton";

async function runTest() : Promise<void>
{
    await openProjectsView();
    await openFirstProject();

    await openOutputWindow();
    await openViewMoreDialogForFirstAlignment();

    await clickPredictedSNPsButton();
    await viewSNP(0);
    await viewSNP(1);
    await closeAllPileupWindows();
    await viewSNP(2);
    await viewSNP(3);
    await closeAllPileupWindows();
    await viewSNP(4);
    await viewSNP(5);
    await closeAllPileupWindows();
    await viewSNP(6);
    await viewSNP(7);

    await closeToolBar();
}
setTimeout(function()
{
    runTest();
},1000);