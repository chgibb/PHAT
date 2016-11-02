const ipc = require("electron").ipcRenderer;
            
var id = require("./req/renderer/MakeValidID");
var fs = require("fs");
var view = require("./req/renderer/view");

var views = new Array();
var currView = "fastq";

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
            render();
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
function render()
{
    //set buttons to bolded depending on the view
    if(currView == 'fastq')
    {
        document.getElementById('fastqButton').src = '../img/fastqButtonActive.png';
        document.getElementById('refSeqButton').src = '../img/refSeqButton.png';
    }
    else if(currView == 'fasta')
    {
        document.getElementById('fastqButton').src = '../img/fastqButton.png';
        document.getElementById('refSeqButton').src = '../img/refSeqButtonActive.png';
    }
    views[view.getIndexOfViewByName(views,currView)].render();
}
$
(
    function()
    {
        addFastaView(views,'loadedFiles');
        addFastqView(views,'loadedFiles');

        views[view.getIndexOfViewByName(views,currView)].mount();

        //point view data to corresponding model data
        views[view.getIndexOfViewByName(views,'fastq')].data.fastqInputs = input.fastqInputs;
        views[view.getIndexOfViewByName(views,'fasta')].data.fastaInputs = input.fastaInputs;

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
                            views[view.getIndexOfViewByName(views,'fastq')].data.fastqInputs = input.fastqInputs;
                        }
                    }
                    if(arg.key == 'fastaInputs')
					{
                        if(arg.val != 0)
                        {
                            input.fastaInputs = arg.val;
                            views[view.getIndexOfViewByName(views,'fasta')].data.fastaInputs = input.fastaInputs;
                        }
                    }
                }
                render();
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
        render();
    }
);
function browse()
{
    if(currView == 'fastq')
        fastqBrowseDialog(input);
    if(currView == 'fasta')
        fastaBrowseDialog(input);
}
function changeView(newView)
{
    views[view.getIndexOfViewByName(views,currView)].unMount();
    currView = newView;
    views[view.getIndexOfViewByName(views,currView)].mount();
    render();
}
