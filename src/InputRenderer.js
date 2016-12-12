const ipc = require("electron").ipcRenderer;
            
var id = require("./req/renderer/MakeValidID");
var fs = require("fs");
var viewMgr = require("./req/renderer/viewMgr");
var debug = require("./req/renderer/sendDebugMessage");
debug.initialize("input");
var views = new Array();

var addFastaView = require("./req/renderer/inputRenderer/FastaView");
var addFastqView = require("./req/renderer/inputRenderer/FastqView");

var fastaBrowseDialog = require("./req/renderer/inputRenderer/fastaBrowseDialog");
var fastqBrowseDialog = require("./req/renderer/inputRenderer/fastqBrowseDialog");
var Input = require("./req/renderer/Input");
var input = new Input
(
    //state channel to operate on
    "input",
    {
        //on attempt to save state
        postStateHandle : function(channel,arg)
        {
            //forward message to main process
            ipc.send(channel,arg);
            //rerender window with updated data
            viewMgr.render();
        },
        //on attempt to spawn a process
        spawnHandle : function(channel,arg)
        {
            //forward message to main process
            ipc.send(channel,arg);
        },
        //On any attempt to access a file system resource.
        //Includes attempts to spawn other processes.
        //This function will be called first with the path to the process
        //to spawn before spawnHandle is invoked.
        //Default paths given assume running under PHAT. If running headless/CLI
        //or if a different directory structure is required then this function can be 
        //used to make necessary changes.
        fsAccess : function(str)
        {
            return str;
        }
    }
);

window.$ = window.jQuery = require('./req/renderer/jquery-2.2.4.js');
function preRender(viewRef)
{
    if(viewMgr.currView == 'fastq')
    {
        document.getElementById('fastqButton').src = 'img/fastqButtonActive.png';
        document.getElementById('refSeqButton').src = 'img/refSeqButton.png';
    }
    else if(viewMgr.currView == 'fasta')
    {
        document.getElementById('fastqButton').src = 'img/fastqButton.png';
        document.getElementById('refSeqButton').src = 'img/refSeqButtonActive.png';
    }
}
viewMgr.preRender = preRender;
$
(
    function()
    {
        addFastaView(viewMgr.views,'loadedFiles',input);
        addFastqView(viewMgr.views,'loadedFiles',input);

        viewMgr.changeView("fastq");

        //get saved data
        ipc.send('input',{replyChannel : 'input', action : 'getState', key : 'fastqInputs'});
        ipc.send('input',{replyChannel : 'input', action : 'getState', key : 'fastaInputs'});

        //subscribe to changes in data
        ipc.send('keySub',{action : "keySub", channel : "input", key : "fastqInputs", replyChannel : "input"});
        ipc.send('keySub',{action : "keySub", channel : "input", key : "fastaInputs", replyChannel : "input"});

        //on message from main process
        ipc.on
		(	
		    'input',function(event,arg)
			{
                //reply from call to getState
			    if(arg.action === "getState")
				{
					if(arg.key == 'fastqInputs')
					{
                        if(arg.val != 0)
                        {
                            input.fastqInputs = arg.val;
                            //views[view.getIndexOfViewByName(views,'fastq')].data.fastqInputs = input.fastqInputs;
                        }
                    }
                    if(arg.key == 'fastaInputs')
					{
                        if(arg.val != 0)
                        {
                            input.fastaInputs = arg.val;
                            //views[view.getIndexOfViewByName(views,'fasta')].data.fastaInputs = input.fastaInputs;
                        }
                    }
                }
                viewMgr.render();
            }
        );
        ipc.on
        (
            "spawnReply",function(event,arg)
            {
                //update from spawned process.
                //forward to handler.
                input.spawnReply(event,arg);
            }
        );
        document.getElementById("fastqButton").onclick = function()
        {
            viewMgr.changeView("fastq");
        }
        document.getElementById("refSeqButton").onclick = function()
        {
            viewMgr.changeView("fasta");
        }
        document.getElementById("browseButton").onclick = function()
        {
            browse();
        }
        viewMgr.render();
    }
);
function browse()
{
    if(viewMgr.currView == 'fastq')
        fastqBrowseDialog(input);
    if(viewMgr.currView == 'fasta')
        fastaBrowseDialog(input);
}

