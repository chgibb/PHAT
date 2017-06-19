import * as atomic from "./req/operations/atomicOperations";
import {GenerateQCReport} from "./req/operations/GenerateQCReport";
import {IndexFasta} from "./req/operations/indexFasta";
import {RunAlignment} from "./req/operations/RunAlignment";
import {RenderCoverageTrackForContig} from "./req/operations/RenderCoverageTrack";
import {RenderSNPTrackForContig} from "./req/operations/RenderSNPTrack";
import {CheckForUpdate} from "./req/operations/CheckForUpdate";
import {DownloadAndInstallUpdate} from "./req/operations/DownloadAndInstallUpdate";
import {alignData} from "./req/alignData";
import Fastq from "./req/fastq";
import {Fasta} from "./req/fasta";
import {CircularFigure} from "./req/renderer/circularFigure";
import * as dataMgr from "./req/main/dataMgr";
import {rebuildRTDirectory} from "./req/main/rebuildRTDirectory"
import {setReadableBasePath,setWritableBasePath,setReadableAndWritableBasePath,getReadableAndWritable} from "./req/getAppPath";

let basePath = "resources/app";
setReadableBasePath(basePath);
setWritableBasePath(basePath);
setReadableAndWritableBasePath(basePath);
rebuildRTDirectory();


import {ProjectManifest,getProjectManifests} from "./req/projectManifest";

import {NewProject} from "./req/operations/NewProject";
import {OpenProject} from "./req/operations/OpenProject";
import {SaveCurrentProject} from "./req/operations//SaveCurrentProject";

const jsonFile = require("jsonfile");

dataMgr.setKey("application","jobErrorLog","jobErrorLog.txt");
dataMgr.setKey("application","jobVerboseLog","jobVerboseLog.txt");

var assert = require("./req/tests/assert");

atomic.register("generateFastQCReport",GenerateQCReport);
atomic.register("indexFasta",IndexFasta);
atomic.register("runAlignment",RunAlignment);
atomic.register("renderCoverageTrackForContig",RenderCoverageTrackForContig);
atomic.register("renderSNPTrackForContig",RenderSNPTrackForContig);

atomic.register("checkForUpdate",CheckForUpdate);
atomic.register("downloadAndInstallUpdate",DownloadAndInstallUpdate);

atomic.register("newProject",NewProject);
atomic.register("openProject",OpenProject);
atomic.register("saveCurrentProject",SaveCurrentProject);

let L6R1R1 : Fastq = new Fastq('data/L6R1.R1.fastq');
let L6R1R2 : Fastq = new Fastq('data/L6R1.R2.fastq');

let hpv16 : Fasta = new Fasta("data/HPV16ref_genomes.fasta");
let hpv18 : Fasta = new Fasta("data/HPV18ref_genomes.fasta");

let L6R1HPV16Alignment : alignData;
let L6R1HPV18Alignment : alignData;

let hpv16Figure : CircularFigure;

atomic.updates.on(
	"generateFastQCReport",function(op : atomic.AtomicOperation)
	{
		if(op.flags.failure)
		{
			console.log(
				`Failed generating QC report for ${(<GenerateQCReport>op).fastq.path}
				${op.extraData}`
				);
		}
		else if(op.flags.success)
		{
			console.log(`Completed generating QC report for ${(<GenerateQCReport>op).fastq.path}`);
		}
		if(op.flags.done)
			assert.runningEvents -= 1;
	}
);

atomic.updates.on(
	"indexFasta",function(op : atomic.AtomicOperation)
	{
		if(op.flags.failure)
		{
			console.log(
				`Failed indexing ${(<IndexFasta>op).fasta.path}
				${op.extraData}`
				);
		}
		else if(op.flags.success)
		{
			console.log(`Completed indexing ${(<IndexFasta>op).fasta.path}`);
		}
		if(op.flags.done)
			assert.runningEvents -= 1;
	}
);
atomic.updates.on(
	"runAlignment",function(op : atomic.AtomicOperation)
	{
		if(op.flags.failure)
		{
			console.log(
				`Failed aligning ${(<RunAlignment>op).fastq1.alias} ${(<RunAlignment>op).fastq2.alias} against ${(<RunAlignment>op).fasta.alias}`	
			);
			console.log(op);
		}
		else if(op.flags.success)
		{
			console.log(
				`Completed aligning ${(<RunAlignment>op).fastq1.alias} ${(<RunAlignment>op).fastq2.alias} against ${(<RunAlignment>op).fasta.alias}`	
			);
			//in the actual application, this would not be done
			if((<RunAlignment>op).fasta.uuid == hpv16.uuid)
				L6R1HPV16Alignment = (<RunAlignment>op).alignData;
			if((<RunAlignment>op).fasta.uuid == hpv18.uuid)
				L6R1HPV18Alignment = (<RunAlignment>op).alignData;
		}
		if(op.flags.done)
			assert.runningEvents -= 1;
	}
);
atomic.updates.on(
	"renderCoverageTrackForContig",function(op : RenderCoverageTrackForContig)
	{
		if(op.flags.success)
		{
			console.log("rendered");
			console.log(op.circularFigure);
		}
		if(op.flags.failure)
		{
			console.log(op.extraData);
		}
		if(op.flags.done)
			assert.runningEvents -= 1;
	}
);

atomic.updates.on(
	"renderSNPTrackForContig",function(op : RenderSNPTrackForContig)
	{
		if(op.flags.success)
		{
			console.log("rendered");
			console.log(op.circularFigure);
		}
		if(op.flags.failure)
		{
			console.log(op);
		}
		if(op.flags.done)
			assert.runningEvents -= 1;
	}
);

atomic.updates.on(
	"checkForUpdate",function(op : CheckForUpdate)
	{
		if(op.flags.done)
		{
			if(op.flags.success)
			{
				if(op.extraData.status == 0)
				{
					console.log(JSON.stringify(op.extraData.asset,undefined,4));
					atomic.addOperation("downloadAndInstallUpdate",
					{
						asset : op.extraData.asset,
						token : op.token
					});
				}
			}
			if(op.flags.failure)
				console.log("failed to check");
			console.log(op);
		}
	}
);
atomic.updates.on(
	"downloadAndInstallUpdate",function(op : DownloadAndInstallUpdate)
	{
		if(op.extraData)
			console.log(op.extraData);
		if(op.flags.done)
		{	//console.log(op);
			assert.runningEvents -= 1;
		}
	}
)

atomic.updates.on(
	"newProject",function(op : NewProject)
	{
		if(op.flags.done)
			assert.runningEvents -= 1;
	}
);

atomic.updates.on(
	"openProject",function(op : NewProject)
	{
		if(op.flags.done)
			assert.runningEvents -= 1;
		if(op.flags.failure)
		{
			console.log(op.extraData);
			process.exit(1);
		}
	}
);

atomic.updates.on(
	"saveCurrentProject",function(op : SaveCurrentProject)
	{
		if(op.flags.done)
			assert.runningEvents -= 1;
		if(op.flags.failure)
		{
			console.log(op.extraData);
			process.exit(1);
		}
	}
);

function fastQReportGeneration()
{
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
		return true;
	},'--------------------------------------------------------',0);
}

function indexHPV16()
{
	assert.assert(function(){
		assert.runningEvents += 1;
		console.log(`Starting to index ${hpv16.path}`);
		atomic.addOperation("indexFasta",hpv16);
		return true;
	},'',0);
}

function indexHPV18()
{
	assert.assert(function(){
		assert.runningEvents += 1;
		console.log(`Starting to index ${hpv18.path}`);
		atomic.addOperation("indexFasta",hpv18);
		return true;
	},'',0);
}

function validateHPV16Index()
{
	assert.assert(function(){
		return hpv16.indexed;
	},'HPV16 was indexed',0);

	assert.assert(function(){
		return hpv16.contigs.length == 1 ? true : false
	},'HPV16 has 1 contig',0);

	assert.assert(function(){
		return hpv16.contigs[0].bp == 7906 ? true : false;
	},'HPV16 has correct number of base pairs',0);
}

function validateHPV18Index()
{
	assert.assert(function(){
		return hpv18.indexed;
	},'HPV18 was indexed',0);

	assert.assert(function(){
		return hpv18.contigs.length == 1 ? true : false
	},'HPV18 has 1 contig',0);

	assert.assert(function(){
		return hpv18.contigs[0].bp == 7857 ? true : false;
	},'HPV18 has correct number of base pairs',0);

}

function alignR1ToHPV16()
{
	assert.assert(function(){

		console.log("aligning L6R1.R1, L6R1.R2 against HPV16");
		atomic.addOperation("runAlignment",{fasta : hpv16,fastq1 : L6R1R1,fastq2 : L6R1R2,type : "patho"})

		assert.runningEvents += 1;
		return true;
	},'',0);
}

function alignR1ToHPV18()
{
	assert.assert(function(){

		console.log("aligning L6R1.R1, L6R1.R2 against HPV18");
		atomic.addOperation("runAlignment",{fasta : hpv18,fastq1 : L6R1R1,fastq2 : L6R1R2,type : "patho"})

		assert.runningEvents += 1;
	return true;
	},'',0);
}

function validateR1ToHPV16Alignment()
{
	assert.assert(function(){
		return L6R1HPV16Alignment.summary.reads == 2689 ? true : false;

	},'Alignment has correct number of reads',0);

	assert.assert(function(){
		return L6R1HPV16Alignment.summary.mates == 4696 ? true : false;

	},'Alignment has correct number of mates',0);

	assert.assert(function(){
		return L6R1HPV16Alignment.summary.overallAlignmentRate == 12.96 ? true : false;

	},'Alignment has correct alignment rate	',0);

	assert.assert(function(){
		return L6R1HPV16Alignment.varScanSNPSummary.minCoverage == 8 ? true : false;

	},'Alignment has correct minimum coverage',0);

	assert.assert(function(){
		return L6R1HPV16Alignment.varScanSNPSummary.minVarFreq == 0.2 ? true : false;

	},'Alignment has correct minimum variable frequency',0);

	assert.assert(function(){
		return L6R1HPV16Alignment.varScanSNPSummary.minAvgQual == 15 ? true : false;

	},'Alignment has correct minimum average quality',0);

	assert.assert(function(){
		return L6R1HPV16Alignment.varScanSNPSummary.pValueThresh == 0.01 ? true : false;

	},'Alignment has correct p-value threshold',0);

	assert.assert(function(){
		return L6R1HPV16Alignment.varScanSNPSummary.SNPsReported == 8 ? true : false;

	},'Alignment has correct predicted SNPs',0);

	assert.assert(function(){
		return L6R1HPV16Alignment.varScanSNPSummary.indelsReported == 0 ? true : false;

	},'Alignment has correct predicted indels',0);

	assert.assert(function(){
		return L6R1HPV16Alignment.idxStatsReport[0].mappedReads == 697 ? true : false;
	},`Alignment has correct number of mapped reads`,0);

	assert.assert(function(){
		return L6R1HPV16Alignment.idxStatsReport[0].unMappedReads == 15 ? true : false;
	},`Alignment has correct number of unmapped reads`,0);

}

function validateR1ToHPV18Alignment()
{
	assert.assert(function(){
		return L6R1HPV18Alignment.summary.reads == 2689 ? true : false;

	},'Alignment has correct number of reads',0);

	assert.assert(function(){
		return L6R1HPV18Alignment.summary.mates == 5378 ? true : false;

	},'Alignment has correct number of mates',0);

	assert.assert(function(){
		return L6R1HPV18Alignment.summary.overallAlignmentRate == 0 ? true : false;

	},'Alignment has correct alignment rate	',0);

	assert.assert(function(){
		return L6R1HPV18Alignment.varScanSNPSummary.minCoverage == 8 ? true : false;

	},'Alignment has correct minimum coverage',0);

	assert.assert(function(){
		return L6R1HPV18Alignment.varScanSNPSummary.minVarFreq == 0.2 ? true : false;

	},'Alignment has correct minimum variable frequency',0);

	assert.assert(function(){
		return L6R1HPV18Alignment.varScanSNPSummary.minAvgQual == 15 ? true : false;

	},'Alignment has correct minimum average quality',0);

	assert.assert(function(){
		return L6R1HPV18Alignment.varScanSNPSummary.pValueThresh == 0.01 ? true : false;

	},'Alignment has correct p-value threshold',0);

	assert.assert(function(){
		return L6R1HPV18Alignment.varScanSNPSummary.SNPsReported == 0 ? true : false;

	},'Alignment has correct predicted SNPs',0);

	assert.assert(function(){
		return L6R1HPV18Alignment.varScanSNPSummary.indelsReported == 0 ? true : false;

	},'Alignment has correct predicted indels',0);

	assert.assert(function(){
		return L6R1HPV18Alignment.idxStatsReport[0].mappedReads == 0 ? true : false;
	},`Alignment has correct number of mapped reads`,0);

	assert.assert(function(){
		return L6R1HPV18Alignment.idxStatsReport[0].unMappedReads == 0 ? true : false;
	},`Alignment has correct number of unmapped reads`,0);
}

function renderHPV16FigureTracks()
{
	assert.assert(function(){
		hpv16Figure = new CircularFigure("HPV16 Figure",hpv16.uuid,hpv16.contigs);
		atomic.addOperation("renderCoverageTrackForContig",{circularFigure : hpv16Figure,contiguuid:hpv16Figure.contigs[0].uuid,alignData:L6R1HPV16Alignment});
		assert.runningEvents += 1;
		return true;
	},'',0);
	assert.assert(function(){
		return true;
	},'--------------------------------------------------------',0);

	assert.assert(function(){
		atomic.addOperation("renderSNPTrackForContig",{circularFigure : hpv16Figure,contiguuid:hpv16Figure.contigs[0].uuid,alignData:L6R1HPV16Alignment});
		assert.runningEvents += 1;
		return true;
	},'',0);
	assert.assert(function(){
		return true;
	},'--------------------------------------------------------',0);
}

setInterval(function(){atomic.runOperations(1);},1000);


assert.assert(function(){
	return true;
},'--------------------------------------------------------',0);

/*assert.assert(function(){
	atomic.addOperation("checkForUpdate",{token : ""});
	assert.runningEvents += 1;
	return true;
},'',0);



assert.assert(function(){
	return true;
},'--------------------------------------------------------',0);
*/

assert.assert(function(){
	assert.runningEvents += 1;

	atomic.addOperation("newProject","Test Project1");
	return true;
},'',0);

assert.assert(function(){

	assert.runningEvents += 1;

	let projectManifest : Array<ProjectManifest> = jsonFile.readFileSync(getProjectManifests());

	if(!projectManifest)
	{
		return false;
	}

	atomic.addOperation("openProject",projectManifest[0]);
	return true;

},'',0);


fastQReportGeneration();

indexHPV16();


validateHPV16Index();


indexHPV18();

validateHPV18Index();




assert.assert(function(){
	return true;
},'--------------------------------------------------------',0);

alignR1ToHPV16();

validateR1ToHPV16Alignment();

alignR1ToHPV18();

validateR1ToHPV18Alignment();





assert.assert(function(){
	assert.runningEvents += 1;
	let projectManifest : Array<ProjectManifest> = jsonFile.readFileSync(getProjectManifests());

	if(!projectManifest)
	{
		return false;
	}
	atomic.addOperation("saveCurrentProject",projectManifest[0]);
	return true;
},'',0);

assert.assert(function(){
	return true;
},'--------------------------------------------------------',0);


assert.assert(function(){

	assert.runningEvents += 1;

	let projectManifest : Array<ProjectManifest> = jsonFile.readFileSync(getProjectManifests());

	if(!projectManifest)
	{
		return false;
	}

	atomic.addOperation("openProject",projectManifest[0]);
	return true;

},'',0);

validateHPV16Index();
validateHPV18Index();
validateR1ToHPV16Alignment();
validateR1ToHPV18Alignment();

renderHPV16FigureTracks();

assert.runAsserts();

