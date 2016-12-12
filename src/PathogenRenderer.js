const ipc = require('electron').ipcRenderer;

var id = require("./req/renderer/MakeValidID");
var viewMgr = require('./req/renderer/view');

var views = new Array();
var currView = "report";

var addReportView = require('./req/renderer/PathogenRenderer/reportView');
var addPileUpView = require('./req/renderer/PathogenRenderer/pileUpView');


window.$ = window.jQuery = require('./req/renderer/jquery-2.2.4.js');
function render()
{
    console.log("Called render");
    console.log("currView is "+currView);
    views[view.getIndexOfViewByName(views,currView)].render();
}

$
(
    function()
    {
        addPileUpView(views,"view");
        addReportView(views,"view");

        views[view.getIndexOfViewByName(views,currView)].mount();



        ipc.on
        (
            'pathogen',function(event,arg)
            {
                if(arg.action === "getState" || arg.action === "keyChange")
                {
                    if(arg.key == 'aligns')
                    {
                        if(arg.val != 0)
                        {
                            views[view.getIndexOfViewByName(views,"pileUp")].aligns = arg.val;
                            views[view.getIndexOfViewByName(views,"report")].aligns = arg.val;
                        }
                        render();
                    }
                    if(arg.key == 'fastaInputs')
                    {
                        if(arg.val != 0)
                        {
                            views[view.getIndexOfViewByName(views,"pileUp")].selectedFastaInputs = new Array();
                            views[view.getIndexOfViewByName(views,"report")].selectedFastaInputs = new Array();
                            for(var i in arg.val)
                            {
                                if(arg.val[i].checked)
                                {
                                    views[view.getIndexOfViewByName(views,"pileUp")].selectedFastaInputs.push(arg.val[i]);
                                    views[view.getIndexOfViewByName(views,"report")].selectedFastaInputs.push(arg.val[i].alias);
                                }
                            }
                            render();
                        }
                    }
                    if(arg.key == 'fastqInputs')
                    {
                        if(arg.val != 0)
                        {
                            views[view.getIndexOfViewByName(views,"report")].selectedFastqInputs = new Array();
                            for(var i in arg.val)
                            {
                                if(arg.val[i].checked)
                                {
                                    views[view.getIndexOfViewByName(views,"report")].selectedFastqInputs.push(arg.val[i].alias);
                                }
                            }
                            render();
                        }
                    }
                    render();
                }
            }
        );



        ipc.send('keySub',{action : "keySub", channel : "align", key : "aligns", replyChannel : "pathogen"});
        ipc.send('align',{replyChannel : 'pathogen', action : 'getState', key : 'aligns'});

        ipc.send('keySub',{action : "keySub", channel : "input", key : "fastaInputs", replyChannel : "pathogen"});
        ipc.send('input',{replyChannel : 'pathogen', action : 'getState', key : 'fastaInputs'});

        ipc.send('keySub',{action : "keySub", channel : "input", key : "fastqInputs", replyChannel : "pathogen"});
        ipc.send('input',{replyChannel : 'pathogen', action : 'getState', key : 'fastqInputs'});
        render();
    }
);

function changeView(newView)
{
    views[view.getIndexOfViewByName(views,currView)].unMount();
    currView = newView;
    views[view.getIndexOfViewByName(views,currView)].mount();
    render();
}
