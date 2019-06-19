import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import {render} from "react-dom";

import * as viewMgr from "./req/renderer/viewMgr";
import {makeWindowDockable} from "./req/renderer/dock";
import * as summary from "./req/renderer/QCRenderer/summaryView";
import * as report from "./req/renderer/QCRenderer/reportView";

import "./req/renderer/commonBehaviour";
import "./req/renderer/styles/defaults";
import { QCRendererApp } from './req/renderer/QCRenderer/app';

render(
    <QCRendererApp />,
    document.getElementById("app")
);

        makeWindowDockable("QC");
        
        summary.addView(viewMgr.views,"reports");
        report.addView(viewMgr.views,"reports");


        viewMgr.changeView("summary");

        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "QC"
            }
        );
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                action : "getKey",
                channel : "application",
                key : "operations",
                replyChannel : "QC"
            }
        );
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                action : "getKey",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "QC"
            }
        );
        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "application",
                key : "operations",
                replyChannel : "QC"
            }
        );
