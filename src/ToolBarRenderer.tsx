import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import {render} from "react-dom";
import {cssRule} from "typestyle";
import {color} from "csx";

import {KeySubEvent} from "./req/ipcEvents";


import "./req/renderer/commonBehaviour";
import "./req/renderer/styles/defaults";
import { ToolBarView } from './req/renderer/views/toolBarView';

cssRule("body",{
    backgroundColor : `${color("#1a89bd")}`
});

render(
    <ToolBarView />,
    document.getElementById("app")
);

        ipc.send(
            "keySub",
            {
                action : "keySub",
                channel : "application",
                key : "operations",
                replyChannel : "toolBar"
            } as KeySubEvent
        );
        
