import * as fs from "fs";
import * as atomic from "./req/atomicOperations";
import {GenerateQCReport} from "./req/GenerateQCReport";
import {IndexFasta} from "./req/indexFasta";
import Fastq from "./req/renderer/fastq";
import {Fasta} from "./req/renderer/fasta";
import {SpawnRequestParams} from "./req/JobIPC";

var assert = require("./req/tests/assert");

try
{
	fs.mkdirSync("rt");
	fs.mkdirSync("resources/app/rt");
	fs.mkdirSync("resources/app/rt/QCReports");
	fs.mkdirSync("resources/app/rt/indexes");
	fs.mkdirSync("resources/app/rt/AlignmentArtifacts");
}
catch(err){}

atomic.register("generateFastQCReport",GenerateQCReport);
atomic.register("indexFasta",IndexFasta);

let L6R1R1 : Fastq = new Fastq('data/L6R1.R1.fastq');
let L6R1R2 : Fastq = new Fastq('data/L6R1.R2.fastq');

let hpv16 : Fasta = new Fasta("data/HPV16ref_genomes.fasta");
let hpv18 : Fasta = new Fasta("data/HPV18ref_genomes.fasta");


atomic.updates.on(
	"generateFastQCReport",function(oup : atomic.OperationUpdate)
	{
		if(oup.op.flags.failure)
		{
			console.log(
				`Failed generating QC report for ${(<GenerateQCReport>oup.op).fastq.path}
				${oup.extraData}`
				);
				//console.log(oup.op.generatedArtifactsDirectories);
			//process.exit(1);
		}
		else if(oup.op.flags.success)
		{
			console.log(`Completed generating QC report for ${(<GenerateQCReport>oup.op).fastq.path}`);
		}
		if(oup.op.flags.done)
			assert.runningEvents -= 1;
	}
);

atomic.updates.on(
	"indexFasta",function(oup : atomic.OperationUpdate)
	{
		if(oup.op.flags.failure)
		{
			console.log(
				`Failed indexing ${(<IndexFasta>oup.op).fasta.path}
				${oup.extraData}`
				);
		}
		else if(oup.op.flags.success)
		{
			console.log(`Completed indexing ${(<IndexFasta>oup.op).fasta.path}`);
			console.log(JSON.stringify(hpv16,undefined,4));
		}
		if(oup.op.flags.done)
			assert.runningEvents -= 1;
	}
);

setInterval(function(){atomic.runOperations(1);},1000);


assert.assert(function(){
	return true;
},'--------------------------------------------------------',0);


assert.assert(function(){
	assert.runningEvents += 1;
	console.log(`Starting report generation for ${L6R1R1.path}`);
	atomic.addOperation("generateFastQCReport",L6R1R1);
	return true;
},'',0);

assert.assert(function(){
	assert.runningEvents += 1;
	console.log(`Starting report generation for ${L6R1R2.path}`);
	atomic.addOperation("generateFastQCReport",L6R1R2);
	return true;
},'',0);

assert.assert(function(){
	assert.runningEvents += 1;
	console.log(`Starting to index ${hpv16.path}`);
	atomic.addOperation("indexFasta",hpv16);
	return true;
},'',0);

assert.assert(function(){
	assert.runningEvents += 1;
	console.log(`Starting to index ${hpv18.path}`);
	atomic.addOperation("indexFasta",hpv18);
	return true;
},'',0);


assert.assert(function(){
	return true;
},'--------------------------------------------------------',0);

assert.runAsserts();

/*
var assert = require('./req/tests/assert');


var Input = require('./req/renderer/Input.js').default;
var QCClass = require('./req/renderer/QC.js');
var Align = require('./req/renderer/Align');

var jobMgr = require('./req/main/JobMgr.js');

setInterval(function(){jobMgr.runJobs();},20);
var inputReplyObject = 
{
	send : function(channel,args)
	{ 
		//patch directly to object
		input.spawnReply(undefined,args);
		
		//Input's handling of replys from bowtie2 are delayed by 5 seconds on purpose
		//in order to allow time for winPython on Windows to properly buffer and send all of its output.
		//winPython is causing output to get forwarded in chunks with its retCode coming first which is causing
		//issues in the usual logic to detect for a closed process.
		//This issue does not exist on Linux but the delay remains in order to keep the response times consistent.
		//Delaying checking the retCode here by 6 seconds will allow enough time for input.spawnReply to process all replies.
		setTimeout
		(
			function()
			{
				//if retCode is defined then the process has ended
				if(args.retCode !== undefined)
				{
					if(args.done && args.retCode != 0)
						console.log(JSON.stringify(args,undefined,4));
					//Update event system
					//console.log("reply from "+args.processName);
					assert.runningEvents -= 1;
				}
			},6000
		);
	}
};
var QCReplyObject = 
{
	send : function(channel,args)
	{
		QC.spawnReply(undefined,args);
		if(args.retCode !== undefined)
		{
			//Update event system
			assert.runningEvents -= 1;
		}	
	}
};
var alignReplyObject = 
{
	send : function(channel,args)
	{	
		align.spawnReply(undefined,args);
		if(args.retCode !== undefined)
		{
			assert.runningEvents -= 1;
		}
		
	}
};
var defaultHandles = 
{
    //on attempt to save state
    postStateHandle : function(channel,arg)
    {

    },	
    //on attempt to spawn a process
    spawnHandle : function(channel,arg)
    {
		assert.runningEvents += 1;
		var channel = this.channel;
		if(channel == 'input')
			jobMgr.addJob(arg.processName,arg.args,'spawnReply',arg.unBuffer,inputReplyObject,arg.extraData);
		else if(channel == 'QC')
			jobMgr.addJob(arg.processName,arg.args,'spawnReply',arg.unBuffer,QCReplyObject,arg.extraData);
		else if(channel == 'align')
			jobMgr.addJob(arg.processName,arg.args,'spawnReply',arg.unBuffer,alignReplyObject,arg.extraData);
		else
		{
			console.log(JSON.stringify(this,undefined,4));
		}
		jobMgr.runJobs();
		console.log('spawned '+arg.processName+ " "+arg.args[0]);
    },
    //On any attempt to access a file system resource.
    //Includes attempts to spawn other processes.
    //This function will be called first with the path to the process
    //to spawn before spawnHandle is invoked.
    //Default paths given assume running under PHAT linux. If running headless/CLI
    //or if a different directory structure is required then this function can be 
    //used to make necessary changes.
    fsAccess : function(str)
    {
        console.log(str);
        return str;
    }
};
var input = new Input('input',defaultHandles);
var QC = new QCClass.default('QC',defaultHandles);
var align = new Align.default('align',defaultHandles);

var containsInvalidIDChars = require('./req/tests/containsInvalidIDChars.js');

//fastq
assert.assert(function(){
	return true;
},'--------------------------------------------------------');


assert.assert(function(){
	return input.addFastq('data/L6R1.R1.fastq');
},'Added first fastq');

assert.assert(function(){
	return input.addFastq('data/L6R1.R2.fastq');
},'Added second fastq');

assert.assert(function(){
	return !input.addFastq('data/L6R1.R2.fake.fastq');
},'Could not add fake fastq');

assert.assert(function(){
	if(input.fastqInputs[0].size)
		return true;
	return false;
},'First fastq size calculated',0);

assert.assert(function(){
	if(input.fastqInputs[1].size)
		return true;
	return false;
},'Second fastq size calculated',0);

assert.assert(function(){
	return !containsInvalidIDChars(input.fastqInputs[0].validID);
},'First fastq does not contain invalid characters');

assert.assert(function(){
	return !containsInvalidIDChars(input.fastqInputs[1].validID);
},'Second fastq does not contain invalid characters');

assert.assert(function(){
	return true;
},'--------------------------------------------------------');


//fasta
assert.assert(function(){
	return true;
},'--------------------------------------------------------');


assert.assert(function(){
	return input.addFasta('data/HPV16ref_genomes.fasta');
},'Added first fasta');

assert.assert(function(){
	return input.addFasta('data/HPV18ref_genomes.fasta');
},'Added second fasta');

assert.assert(function(){
	if(input.fastaInputs[0].size)
		return true;
	return false;
},'First fasta size calculated',0);

assert.assert(function(){
	if(input.fastaInputs[1].size)
		return true;
	return false;
},'Second fasta size calculated',0);

assert.assert(function(){
	return !containsInvalidIDChars(input.fastaInputs[0].validID);
},'First fasta does not contain invalid characters');

assert.assert(function(){
	return !containsInvalidIDChars(input.fastaInputs[1].validID);
},'Second fasta does not contain invalid characters');

assert.assert(function(){
	return input.indexFasta(input.fastaInputs[0].name);
},'Generating index for first fasta');


assert.assert(function(){
	return input.indexFasta(input.fastaInputs[1].name);
},'Generating index for second fasta');

assert.assert(function(){
	return input.fastaInputs[0].indexed
},'Generated index for first fasta',0);

assert.assert(function(){
	return input.fastaInputs[1].indexed
},'Generated index for second fasta',0);

assert.assert(function(){
	return true;
},'--------------------------------------------------------');

//QC

assert.assert(function(){
	return true;
},'--------------------------------------------------------');

assert.assert(function(){
	return QC.addQCData(input.fastqInputs[0].name);
},'Added QC data to first fastq');

assert.assert(function(){
	return QC.QCDataItemExists(input.fastqInputs[0].name);
},'QC data for first fastq exists');

assert.assert(function(){
	return QC.addQCData(input.fastqInputs[1].name);
},'Added QC data to second fastq');

assert.assert(function(){
	return QC.QCDataItemExists(input.fastqInputs[1].name);
},'QC data for second fastq exists');

assert.assert(function(){
	return QC.generateQCReport(input.fastqInputs[0].name);
},'Generating report for first fastq');

assert.assert(function(){
	return QC.generateQCReport(input.fastqInputs[1].name);
},'Generating report for second fastq');

assert.assert(function(){
	if(QC.QCData[0].QCReport != "")
		return true;
	return false;
},'Generated report for first fastq',0);


assert.assert(function(){
	if(QC.QCData[1].QCReport != "")
		return true;
	return false;
},'Generated report for second fastq',0);


assert.assert(function(){
	return true;
},'--------------------------------------------------------');



//align

assert.assert(function(){
	return true;
},'--------------------------------------------------------');

//validate date formatter

assert.assert(function(){
	var dFormat = require('./req/renderer/dateFormat');
	if(dFormat.generateFixedSizeDateStamp().length == 17)
		return true;
	return false;
},'Fixed size date stamp generator is producing date stamps of size 17');

assert.assert(function(){
	var dFormat = require('./req/renderer/dateFormat');
	//should be YYYY-MM-DD HH:MM:SS:mSmSmS
	var r = new RegExp("(\\d\\d\\d\\d-)(\\d\\d-)(\\d\\d)( \\d\\d:\\d\\d:\\d\\d:\\d\\d\\d)","g");
	return r.test(dFormat.formatDateStamp(dFormat.generateFixedSizeDateStamp()));
},'Formatted fixed size date stamp is of the correct format');

assert.assert(function(){
	return align.runAlignment([input.fastqInputs[0],input.fastqInputs[1]],input.fastaInputs[0],"pathogen");
},'Started first alignment');

assert.assert(function(){
	return align.runAlignment([input.fastqInputs[0],input.fastqInputs[1]],input.fastaInputs[1],"pathogen");
},'Started second alignment',0);

assert.assert(function(){
	if(align.aligns[0].summary)
		return true;
	return false;
},'Created summary report for first alignment',0);

assert.assert(function(){
	if(align.aligns[0].summary.reads == 2689)
		return true;
	return false;
},'First alignment has 2689 reads',0)

assert.assert(function(){
	if(align.aligns[0].summary.mates == 4696)
		return true;
	return false;
},'First alignment has 4696 mates',0)

assert.assert(function(){
	if(align.aligns[0].summary.overallAlignmentRate == 12.96)
		return true;
	return false;
},'First alignment has alignment rate of 12.96%',0)




assert.assert(function(){
	if(align.aligns[1].summary)
		return true;
	return false;
},'Created summary report for second alignment',0);

assert.assert(function(){
	if(align.aligns[1].summary.reads == 2689)
		return true;
	return false;
},'Second alignment has 2689 reads',0)

assert.assert(function(){
	if(align.aligns[1].summary.mates == 5378)
		return true;
	return false;
},'Second alignment has 5378 mates',0)

assert.assert(function(){
	if(align.aligns[1].summary.overallAlignmentRate == 0)
		return true;
	return false;
},'Second alignment has alignment rate of 0.0%',0)

assert.assert(function(){
	return true;
},'--------------------------------------------------------',0);





assert.runAsserts();
*/