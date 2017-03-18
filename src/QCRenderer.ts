/*const ipc = require('electron').ipcRenderer;

let id = require("./req/renderer/MakeValidID");
let viewMgr = require('./req/renderer/viewMgr');
let QCClass = require('./req/renderer/QC');

let addSummaryView = require('./req/renderer/QCRenderer/summaryView');
let addReportView = require('./req/renderer/QCRenderer/reportView');*/

import * as electron from "electron";
const ipc = electron.ipcRenderer;

import * as viewMgr from "./req/renderer/viewMgr";
import {makeValidID} from "./req/renderer/MakeValidID";

import QCClass from "./req/renderer/QC";

require("./req/renderer/commonBehaviour");

let QC = new QCClass
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
//window.$ = window.jQuery = require('jquery');
import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");

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
        
		
		//ipc.send('QC',{replyChannel : 'QC', action : 'getState', key : 'QCData'});
		//ipc.send('input',{replyChannel : 'QC', action : 'getState', key : 'fastqInputs'});

        ipc.on
        (
            'QC',function(event,arg)
            {
                console.log(JSON.stringify(arg,undefined,4));
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == 'QCData')
                    {
                        if(arg.val !== undefined )
                        {
                            QC.QCData = arg.val;
                            //views[view.getIndexOfViewByName(views,'summary')].data.QCData = QC.QCData;
                        }
                    }
                    if(arg.key == "fastqInputs")
                    {
                        if(arg.val !== undefined)
                        {
                            /*for(let i in arg.val)
                            {
                                QC.addQCData(arg.val[i].name)
                            }*/
                            for(let i = 0; i != arg.val.length; ++i)
                            {
                                QC.addQCData(arg.val[i].name);
                            }
                            QC.postQCData();
                            //views[view.getIndexOfViewByName(views,'summary')].data.QCData = QC.QCData;
                            //views[view.getIndexOfViewByName(views,'summary')].data.fastqInputs = arg.val;
                            viewMgr.getViewByName("summary").data.fastqInputs = arg.val;
                            viewMgr.render();
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
                                $('#'+makeValidID(arg.args[idx])).text(regResult[0]);
                            }
                        }
                    }
                }
                QC.spawnReply("spawnReply",arg);
            }
        );
        viewMgr.render();
    }
);
