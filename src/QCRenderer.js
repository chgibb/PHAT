const ipc = require('electron').ipcRenderer;

var id = require("./req/renderer/MakeValidID");
var viewMgr = require('./req/renderer/viewMgr');
var QCClass = require('./req/renderer/QC');

var addSummaryView = require('./req/renderer/QCRenderer/summaryView');
var addReportView = require('./req/renderer/QCRenderer/reportView');
require("./req/renderer/commonBehaviour");

var QC = new QCClass
(
    'QC',
    {
        postStateHandle : function(channel,arg)
        {
            ipc.send(channel,arg);
        },
        spawnHandle : function(channel,arg)
        {
            ipc.send(channel,arg);
        },
        fsAccess : function(str)
        {
            return str;
        }
    }
);
window.$ = window.jQuery = require('jquery');

$
(
    function()
    {
        addSummaryView(viewMgr.views,'reports',QC);
        addReportView(viewMgr.views,'reports',QC);


        viewMgr.changeView("summary");

        ipc.send('keySub',{action : "keySub", channel : "input", key : "fastqInputs", replyChannel : "QC"});
		ipc.send('keySub',{action : "keySub", channel : "input", key : "fastqInputs", replyChannel : "QC"});
		ipc.send('keySub',{action : "keySub", channel : "QC", key : "QCData", replyChannel : "QC"});
	
		
		ipc.send('QC',{replyChannel : 'QC', action : 'getState', key : 'QCData'});
		ipc.send('input',{replyChannel : 'QC', action : 'getState', key : 'fastqInputs'});

        ipc.on
        (
            'QC',function(event,arg)
            {
                if(arg.action == "getState" || arg.action == "keyChange")
                {
                    if(arg.key == "fastqInputs")
                    {
                        if(arg.val != 0)
                        {
                            for(var i in arg.val)
                            {
                                QC.addQCData(arg.val[i].name)
                            }
                            QC.postQCData();
                            //views[view.getIndexOfViewByName(views,'summary')].data.QCData = QC.QCData;
                            //views[view.getIndexOfViewByName(views,'summary')].data.fastqInputs = arg.val;
                            viewMgr.getViewByName("summary").data.fastqInputs = arg.val;
                            viewMgr.render();
                        }
                    }
                    if(arg.key == 'QCData')
                    {
                        if(arg.val != 0 )
                        {
                            QC.QCData = arg.val;
                            //views[view.getIndexOfViewByName(views,'summary')].data.QCData = QC.QCData;
                        }
                    }
                }
                viewMgr.render();
            }
        );
        let validFastQCOut = new RegExp("[0-9]|[.]","g");
        let trimOutFastQCPercentage = new RegExp("[0-9][0-9][%]|[0-9][%]","g");
        ipc.on
        (
            "spawnReply",function(event,arg)
            {
                if(arg.processName == QC.fastQC)
                {
                    if(!arg.done)
                    {
                        if(arg.unBufferedData)
                        {
                            if(validFastQCOut.test(arg.unBufferedData))
                            {
                                let regResult = trimOutFastQCPercentage.exec(arg.unBufferedData);
                                if(regResult && regResult[0])
                                    $('#'+id.makeValidID(arg.args[0])).text(regResult[0]);
                            }
                        }
                    }
                }
                QC.spawnReply(event,arg);
            }
        );
        viewMgr.render();
    }
);
