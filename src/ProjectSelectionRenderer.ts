import * as electron from "electron";
const ipc = electron.ipcRenderer;

const Dialogs = require("dialogs");
const dialogs = Dialogs();

import {checkServerPermission} from "./req/checkServerPermission";
import formatByteString from "./req/renderer/formatByteString";

import * as viewMgr from "./req/renderer/viewMgr";

import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");

$
(
    function()
    {
    }
);