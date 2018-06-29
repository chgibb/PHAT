console.log("Started GUI test for alignment viewing");
import("./../req/main/main");

import {logMainProcessErrors} from "./req/logMainProcessErrors";
logMainProcessErrors();

import {openProjectsView} from "./req/projectSelection/openProjectsView";
import {openFirstProject} from "./req/projectSelection/openFirstProject";
import {openOutputWindow} from "./req/output/openOutputWindow";
import {toggleOptionsPanel} from "./req/output/toggleOptionsPanel";
import {toggleMinimumCoverageCheckBox} from "./req/output/toggleMinimumCoverageCheckBox";
import {toggleMinimumVariableFrequencyCheckBox} from "./req/output/toggleMinimumVariableFrequencyCheckBox";
import {toggleMinimumAverageQualityCheckBox} from "./req/output/toggleMinimumAverageQualityCheckBox";
import {togglePValueThresholdCheckBox} from "./req/output/togglePValueThresholdCheckBox";
import {toggleDateRanCheckBox} from "./req/output/toggleDateRanCheckBox";
import {openSNPTableForFirstAlignment} from "./req/output/openSNPTableForFirstAlignment";
import {viewSNP} from "./req/output/viewSNP";
import {openPileupViewerSucess} from "./req/output/openPileupViewerSuccess";
import {closeAllPileupWindows} from "./req/pileup/closeAllPileupWindows";

import {openInputWindow} from "./req/input/openInputWindow";
import {openRefSeqTab} from "./req/input/openRefSeqTab";
import {indexRefsForVisualization} from "./req/input/indexRefsForVisualization";
import {indexForVisualizationSuccess} from "./req/input/indexForVisualizationSuccess"

import {closeAllTabs} from "./req/closeAllTabs";
import {closeToolBar} from "./req/closeToolBar";

async function runTest() : Promise<void>
{
    await openProjectsView();
    await openFirstProject();

    await openOutputWindow();
    await toggleOptionsPanel();
    await toggleMinimumCoverageCheckBox();
    await toggleMinimumVariableFrequencyCheckBox();
    await toggleMinimumAverageQualityCheckBox();
    await togglePValueThresholdCheckBox();
    await toggleDateRanCheckBox();
    await toggleOptionsPanel();
    await openSNPTableForFirstAlignment();

    await closeAllTabs();

    await openInputWindow();
    await openRefSeqTab();
    await indexRefsForVisualization();
    await indexForVisualizationSuccess();

    await closeAllTabs();

    await openOutputWindow();
    await toggleOptionsPanel();
    await toggleMinimumCoverageCheckBox();
    await toggleMinimumVariableFrequencyCheckBox();
    await toggleMinimumAverageQualityCheckBox();
    await togglePValueThresholdCheckBox();
    await toggleDateRanCheckBox();
    await toggleOptionsPanel();
    await openSNPTableForFirstAlignment();
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
setTimeout(function(){
    runTest();
},1000);