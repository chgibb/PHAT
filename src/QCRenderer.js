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

        //ipc.send('keySub',{action : "keySub", channel : "input", key : "fastqInputs", replyChannel : "QC"});
		//ipc.send('keySub',{action : "keySub", channel : "input", key : "fastqInputs", replyChannel : "QC"});
		//ipc.send('keySub',{action : "keySub", channel : "QC", key : "QCData", replyChannel : "QC"});
        ipc.send(
            "keySub",
            {
                action : "keySub",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "QC"
            }
        );
        ipc.send(
            "keySub",
            {
                action : "keySub",
                channel : "QC",
                key : "QCData",
                replyChannel : "QC"
            }
        );


        ipc.send(
            "getKey",
            {
                action : "getKey",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "QC"
            }
        );
        ipc.send(
            "getKey",
            {
                action : "getKey",
                channel : "QC",
                key : "QCData",
                replyChannel : "QC"
            }
        );
		
		//ipc.send('QC',{replyChannel : 'QC', action : 'getState', key : 'QCData'});
		//ipc.send('input',{replyChannel : 'QC', action : 'getState', key : 'fastqInputs'});

        /*
            ipc.on is where windows handle new messages from ipc
        */
        ipc.on
        (
            'QC',function(event,arg)
            {
                console.log(JSON.stringify(arg,undefined,4));
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "fastqInputs")
                    {
                        /**
                         * RemoveSelected button clears the fastaInput array, so if it is empty,
                         * clear the QC.QCData list (edge case).
                         */
                        console.log(arg.val.length+" = arg val length");
                        if (arg.val === undefined) { //if empty
                            console.log("clearing QC Data!!!!!!!!!");
                            for (var d = 0; d < QC.QCData.length; d++) { QC.QCData.pop(); }
                            arg.val = [];
                        } else {
                            /**
                             * Remove the entries from QC that are no longer in Input.
                             */
                            for(var i = QC.QCData.length-1; i > -1; i--)
                            {
                                var arg_val_name = i > -1 && i < arg.val.length ? arg.val[i].name : "";
                                console.log(arg_val_name+" <-> "+QC.QCData[i].name+"\n");
                                if (QC.QCData[i].name != arg_val_name) 
                                {
                                    QC.QCData.splice(i, 1);
                                }
                            }

                            /**
                             * For every input that does not have associated QC data, create QC data.
                             */
                            for(var i = 0; i < arg.val.length; i++)
                            {
                                QC.addQCData(arg.val[i].name);
                            }

                        }

                        /**
                         * Post the data to the window?
                         */
                        QC.postQCData();
                        //views[view.getIndexOfViewByName(views,'summary')].data.QCData = QC.QCData;
                        //views[view.getIndexOfViewByName(views,'summary')].data.fastqInputs = arg.val;
                        viewMgr.getViewByName("summary").data.fastqInputs = arg.val;
                        viewMgr.render();

                    }
                if(arg.key == 'QCData')
                {
                    if(arg.val != 0 )
                    {
                        if(arg.val !== undefined )
                        {
                            QC.QCData = arg.val;
                            //views[view.getIndexOfViewByName(views,'summary')].data.QCData = QC.QCData;
                        }
                        QC.QCData = arg.val;
                        //views[view.getIndexOfViewByName(views,'summary')].data.QCData = QC.QCData;
                    }
                }}
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
                    if(arg.unBufferedData)
                    {
                        if(validFastQCOut.test(arg.unBufferedData))
                        {
                            let regResult = trimOutFastQCPercentage.exec(arg.unBufferedData);
                            if(regResult && regResult[0])
                            {
                                let idx = -1;
                                if(process.platform == "linux")
                                    idx = 0;
                                else if(process.platform == "win32")
                                    idx = 1;
                                $('#'+id.makeValidID(arg.args[idx])).text(regResult[0]);
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
