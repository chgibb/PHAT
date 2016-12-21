const ipc = require("electron").ipcRenderer;
window.$ = window.jQuery = require('./req/renderer/jquery-2.2.4.js');
            
var id = require("./req/renderer/MakeValidID");
var viewMgr = require("./req/renderer/viewMgr");
require("./req/renderer/commonBehaviour");

var addReportView = require("./req/renderer/OutputRenderer/reportView");
var addMasterView = require("./req/renderer/OutputRenderer/masterView");
$
(
    function()
    {
        addMasterView.addView(viewMgr.views,"view");
        viewMgr.changeView("masterView");


        viewMgr.render();
    }
);