const ipc = require("electron").ipcRenderer;
window.$ = window.jQuery = require('./req/renderer/jquery-2.2.4.js');
            
var id = require("./req/renderer/MakeValidID");
var viewMgr = require("./req/renderer/viewMgr");

var addReportView = require("./req/renderer/OutputRenderer/reportView");
$
(
    function()
    {
    }
);