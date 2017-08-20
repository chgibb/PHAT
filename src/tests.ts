import * as atomic from "./req/operations/atomicOperations";
import {registerOperations} from "./req/tests/registerOperations";

import {rebuildRTDirectory} from "./req/main/rebuildRTDirectory";

import * as L6R1R1 from "./req/tests/L6R1R1";
import * as L6R1R2 from "./req/tests/L6R1R2";
import * as hpv16Ref from "./req/tests/hpv16Ref";
import * as hpv18Ref from "./req/tests/hpv18Ref";
import * as hpv16Figure from "./req/tests/hpv16Figure";

import {testVersionParser} from "./req/tests/testVersionParser";
import {testFastQCReportGeneration} from "./req/tests/testFastQCReportGeneration";
import {testHPV16Index} from "./req/tests/testHPV16Index";
import {testHPV18Index} from "./req/tests/testHPV18Index";
import {testHPV16IndexForVisualization} from "./req/tests/testHPV16IndexForVisualization";
import {testL6R1HPV16Alignment} from "./req/tests/testL6R1HPV16Alignment";
import {testL6R1HPV18Alignment} from "./req/tests/testL6R1HPV18Alignment"
import {testL6R1HPV16CoverageTrackRenderer} from "./req/tests/testL6R1HPV16CoverageTrackRender";
import {testL6R1HPV16SNPTrackRenderer} from "./req/tests/testL6R1HPV16SNPTrackRender";
import {testL6R1HPV16CoverageTrackCompilation} from "./req/tests/testL6R1HPV16CoverageTrackCompilation";
import {testL6R1HPV18CoverageTrackRenderer} from "./req/tests/testL6R1HPV18CoverageTrackRender";
import {testL6R1HPV18SNPTrackRenderer} from "./req/tests/testL6R1HPV18SNPTrackRender";


const pjson = require("./resources/app/package.json");
import {isBeta,versionIsGreaterThan} from "./req/versionIsGreaterThan";

let opsRunner = setInterval(function(){atomic.runOperations(1);},1000);
async function runTests() : Promise<void>
{
	return new Promise<void>(async (resolve,reject) => {

		console.log("Testing version parsing");
		try
		{
			await testVersionParser();
		}
		catch(err)
		{
			return reject();
		}
		
		console.log("Validating version in package.json")
		try
		{
			let beta = isBeta(pjson.version);
		}
		catch(err)
		{
			console.log("Version in package.json is malformed");
			return reject();
		}

		console.log("Generating FastQC report for L6R1R1");
		atomic.addOperation("generateFastQCReport",L6R1R1.get());
		try
		{
			await testFastQCReportGeneration();
		}
		catch(err){}

		console.log("Generating FastQC report for L6R1R2");
    	atomic.addOperation("generateFastQCReport",L6R1R2.get());
		try
		{
			await testFastQCReportGeneration();
		}
		catch(err){}

		console.log("Starting to index hpv16");
		atomic.addOperation("indexFastaForAlignment",hpv16Ref.get());
		try
		{
			await testHPV16Index();
		}
		catch(err)
		{
			console.log("test index threw exception");
			return reject();
		}

		console.log("Starting to index hpv18");
		atomic.addOperation("indexFastaForAlignment",hpv18Ref.get());
		try
		{
			await testHPV18Index();
		}
		catch(err)
		{
			console.log("test index threw exception");
			return reject();
		}

		console.log("Starting to index hpv16 for visualization");
		atomic.addOperation("indexFastaForVisualization",hpv16Ref.get());
		try
		{
			await testHPV16IndexForVisualization();
		}
		catch(err)
		{
			console.log("test index for visualization threw exception");
			return reject();
		}

		console.log("Starting to align L6R1R1, L6R1R2 against hpv16");
		atomic.addOperation(
			"runAlignment",
			{
				fasta : hpv16Ref.get(),
				fastq1 : L6R1R1.get(),
				fastq2 : L6R1R2.get()
			}
		);
		try
		{
			await testL6R1HPV16Alignment();
		}
		catch(err)
		{
			console.log("test alignment threw exception");
			return reject();
		}

		console.log("Starting to align L6R1R1, L6R1R2 against hpv18");
		atomic.addOperation(
			"runAlignment",
			{
				fasta : hpv18Ref.get(),
				fastq1 : L6R1R1.get(),
				fastq2 : L6R1R2.get()
			}
		);
		try
		{
			await testL6R1HPV18Alignment();
		}
		catch(err)
		{
			console.log("test alignment threw exception");
			return reject();
		}

		console.log("Rendering coverage track for L6R1 alignment against HPV16")
		try
		{
			await testL6R1HPV16CoverageTrackRenderer();
		}
		catch(err)
		{
			console.log("coverage track rendering threw exception");
			return reject();
		}

		console.log("Rendering SNP track for L6R1 alignment against HPV16")
		try
		{
			await testL6R1HPV16SNPTrackRenderer();
		}
		catch(err)
		{
			console.log("SNP track rendering threw exception");
			return reject();
		}

		let firstSVG = "";
		let secondSVG = "";
		console.log("Compiling coverage track for L6R1 alignment against HPV16");
		try
		{
			firstSVG = await testL6R1HPV16CoverageTrackCompilation();
		}
		catch(err)
		{
			console.log("Coverage track compilation threw exception");
			return reject();
		}


		console.log("Compiling coverage track for L6R1 alignment against HPV16");
		try
		{
			let tmp = hpv16Figure.get();
			tmp.radius = 600;
			hpv16Figure.set(tmp);
			secondSVG = await testL6R1HPV16CoverageTrackCompilation();
			if(firstSVG == secondSVG)
			{
				console.log("Failed to recompile coverage track for L6R1 with new radius");
				return reject();
			}
			console.log("Successfully recompiled coverage track with new radius");
		}
		catch(err)
		{
			console.log("Coverage track compilation threw exception");
			return reject();
		}

		console.log("Rendering coverage track for L6R1 alignment against HPV18")
		try
		{
			await testL6R1HPV18CoverageTrackRenderer();
		}
		catch(err)
		{
			console.log("coverage track rendering threw exception");
			return reject();
		}

		console.log("Rendering SNP track for L6R1 alignment against HPV18")
		try
		{
			await testL6R1HPV18SNPTrackRenderer();
		}
		catch(err)
		{
			console.log("coverage track rendering threw exception");
			return reject();
		}
		resolve();
	});

}
setTimeout(function(){
	(async function(){
		rebuildRTDirectory();
		registerOperations();

		L6R1R1.loadNoSpaces();
		L6R1R2.loadNoSpaces();
		hpv16Ref.loadNoSpaces();
		hpv18Ref.loadNoSpaces();

		try
		{
			await runTests();
		}
		catch(err)
		{
			console.log("run tests threw exception");
			clearInterval(opsRunner);
			process.exit(1);
		}

		L6R1R1.loadSpaces();
		L6R1R2.loadSpaces();
		hpv16Ref.loadNoSpaces();
		hpv18Ref.loadNoSpaces();

		try
		{
			await runTests();
		}
		catch(err)
		{
			console.log("run tests threw exception");
			clearInterval(opsRunner);
			process.exit(1);
		}

		clearInterval(opsRunner);
		process.exit(0);
	})();
},1000);
