const ipc = require('electron').ipcRenderer;

var id = require("./req/renderer/MakeValidID");
var viewMgr = require('./req/renderer/view');

var addReportView = require('./req/renderer/PathogenRenderer/reportView');
var addPileUpView = require('./req/renderer/PathogenRenderer/pileUpView');


window.$ = window.jQuery = require('./req/renderer/jquery-2.2.4.js');

$
(
    function()
    {
        addPileUpView(views,"view");
        addReportView(views,"view");

        viewMgr.changeView("report");



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
                            viewMgr.getIndexOfViewByName("pileUp").aligns = arg.val;
                            viewMgr.getIndexOfViewByName("report").aligns = arg.val;
                        }
                        render();
                    }
                    if(arg.key == 'fastaInputs')
                    {
                        if(arg.val != 0)
                        {
                            viewMgr.getIndexOfViewByName("pileUp").selectedFastaInputs = new Array();
                            viewMgr.getIndexOfViewByName("report").selectedFastaInputs = new Array();
                            for(var i in arg.val)
                            {
                                if(arg.val[i].checked)
                                {
                                    viewMgr.getIndexOfViewByName("pileUp").selectedFastaInputs.push(arg.val[i]);
                                    viewMgr.getIndexOfViewByName("report").selectedFastaInputs.push(arg.val[i].alias);
                                }
                            }
                            render();
                        }
                    }
                    if(arg.key == 'fastqInputs')
                    {
                        if(arg.val != 0)
                        {
                            viewMgr.getIndexOfViewByName("report").selectedFastqInputs = new Array();
                            for(var i in arg.val)
                            {
                                if(arg.val[i].checked)
                                {
                                    viewMgr.getIndexOfViewByName("report").selectedFastqInputs.push(arg.val[i].alias);
                                }
                            }
                            viewMgr.render();
                        }
                    }
                    viewMgr.render();
                }
            }
        );



        ipc.send('keySub',{action : "keySub", channel : "align", key : "aligns", replyChannel : "pathogen"});
        ipc.send('align',{replyChannel : 'pathogen', action : 'getState', key : 'aligns'});

        ipc.send('keySub',{action : "keySub", channel : "input", key : "fastaInputs", replyChannel : "pathogen"});
        ipc.send('input',{replyChannel : 'pathogen', action : 'getState', key : 'fastaInputs'});

        ipc.send('keySub',{action : "keySub", channel : "input", key : "fastqInputs", replyChannel : "pathogen"});
        ipc.send('input',{replyChannel : 'pathogen', action : 'getState', key : 'fastqInputs'});
        viewMgr.render();
    }
);

