import * as atomic from "./req/operations/atomicOperations";
import {registerOperations} from "./req/tests/registerOperations";

import {rebuildRTDirectory} from "./req/main/rebuildRTDirectory";

import {getUnSortedBam,getSam} from "./req/alignData";

import * as L6R1R1 from "./req/tests/L6R1R1";
import * as L6R1R2 from "./req/tests/L6R1R2";
import * as hpv16Ref from "./req/tests/hpv16Ref";
import * as hpv18Ref from "./req/tests/hpv18Ref";
import * as hpv16Figure from "./req/tests/hpv16Figure";
import * as L6R1HPV16Align from "./req/tests/L6R1HPV16Align";
import * as L6R1HPV18Align from "./req/tests/L6R1HPV18Align";

import * as L6R7R1 from "./req/tests/L6R7R1";
import * as L6R7R2 from "./req/tests/L6R7R2";
import * as L6R7HPV16Align from "./req/tests/L6R7HPV16Align";

import * as L6R1HPV16AlignImported from "./req/tests/L6R1HPV16AlignImported";
import * as L6R1HPV18AlignImported from "./req/tests/L6R1HPV18AlignImported";


import {testVersionParser} from "./req/tests/testVersionParser";

import {testFastQCReportGeneration} from "./req/tests/testFastQCReportGeneration";
import {testHPV16Index} from "./req/tests/testHPV16Index";
import {testHPV18Index} from "./req/tests/testHPV18Index";
import {testHPV16IndexForVisualization} from "./req/tests/testHPV16IndexForVisualization";
import {testHPV18IndexForVisualization} from "./req/tests/testHPV18IndexForVisualization";
import {testL6R1HPV16Alignment} from "./req/tests/testL6R1HPV16Alignment";
import {testL6R1HPV18Alignment} from "./req/tests/testL6R1HPV18Alignment"
import {testL6R1HPV16CoverageTrackRenderer} from "./req/tests/testL6R1HPV16CoverageTrackRender";
import {testL6R1HPV16SNPTrackRenderer} from "./req/tests/testL6R1HPV16SNPTrackRender";
import {testL6R1HPV16CoverageTrackCompilation} from "./req/tests/testL6R1HPV16CoverageTrackCompilation";
import {testL6R1HPV16SNPTrackCompilation} from "./req/tests/testL6R1HPV16SNPTrackCompilation";
import {testL6R1HPV18CoverageTrackRenderer} from "./req/tests/testL6R1HPV18CoverageTrackRender";
import {testL6R1HPV18SNPTrackRenderer} from "./req/tests/testL6R1HPV18SNPTrackRender";

import {testL6R1HPV16AlignImportedImporting} from "./req/tests/testL6R1HPV16AlignImportedImporting";
import {testL6R1HPV16AlignImportedLinking} from "./req/tests/testL6R1HPV16AlignImportedLinking";
import {testL6R1HPV18AlignImportedImporting} from "./req/tests/testL6R1HPV18AlignImportedImporting";
import {testL6R1HPV18AlignImportedLinking} from "./req/tests/testL6R1HPV18AlignImportedLinking";

import {testL6R7HPV16Alignment} from "./req/tests/testL6R7HPV16Alignment";
import {testL6R7HPV16CoverageTrackRenderer} from "./req/tests/testL6R7HPV16CoverageTrackRenderer";
import {testL6R7HPV16SNPTrackRenderer} from "./req/tests/testL6R7HPV16SNPTrackRender";
import {testL6R7HPV16CoverageTrackCompilation} from "./req/tests/testL6R7HPV16CoverageTrackCompilation";
import {testL6R7HPV16SNPTrackCompilation} from "./req/tests/testL6R7HPV16SNPTrackCompilation";

import {testBLASTSegment0To1000L6R1HPV16Alignment} from "./req/tests/testBLASTSegment0To1000L6R1HPV16Alignment";
import {testBLASTSegment3500To4500L6R1HPV16Alignment} from "./req/tests/testBLASTSegment3500To4500L6R1HPV16Alignment";
import {testBLASTSegment5To10L6R7HPV16Alignment} from "./req/tests/testBLASTSegment5To10L6R7HPV16Alignment";

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
		catch(err)
		{
			console.log("failed to generate FastQC report for L6R1R1");
			return reject();
		}

		console.log("Generating FastQC report for L6R1R2");
    	atomic.addOperation("generateFastQCReport",L6R1R2.get());
		try
		{
			await testFastQCReportGeneration();
		}
		catch(err)
		{
			console.log("failed to generate FastQC report for L6R1R2");
			return reject();
		}

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

		console.log("Starting to index hpv18 for visualization");
		atomic.addOperation("indexFastaForVisualization",hpv18Ref.get());
		try
		{
			await testHPV18IndexForVisualization();
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

		console.log("Compiling coverage track for L6R1 alignment against HPV16");
		try
		{
			await testL6R1HPV16CoverageTrackCompilation();
		}
		catch(err)
		{
			console.log("Coverage track compilation threw exception");
			return reject();
		}

		console.log("Compiling SNP track for L6R1 alignment against HPV16");
		try
		{
			await testL6R1HPV16SNPTrackCompilation();
		}
		catch(err)
		{
			console.log("SNP track compilation threw exception");
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

		console.log("Importing binary alignment map from L6R1 HPV16 alignment");
		atomic.addOperation("inputBamFile",{
			bamPath : getUnSortedBam(L6R1HPV16Align.get())});
		try
		{
			await testL6R1HPV16AlignImportedImporting();
		}
		catch(err)
		{
			console.log("bam importing threw exception");
			return reject();
		}

		console.log("Linking imported L6R1 HPV16 binary alignment map to HPV16");
		atomic.addOperation("linkRefSeqToAlignment",{
			align : L6R1HPV16AlignImported.get(),
			fasta : hpv16Ref.get()
		});
		try
		{
			await testL6R1HPV16AlignImportedLinking();
		}
		catch(err)
		{
			console.log("bam linking threw exception");
			return reject();
		}

		console.log("Importing binary alignment map from L6R1 HPV18 alignment");
		atomic.addOperation("inputBamFile",{
			bamPath : getUnSortedBam(L6R1HPV18Align.get())
		});
		try
		{
			await testL6R1HPV18AlignImportedImporting();
		}
		catch(err)
		{
			console.log("bam importing threw exception "+err);
			return reject();
		}

		console.log("Linking imported L6R1 HPV18 binary alignment map to HPv18");
		atomic.addOperation("linkRefSeqToAlignment",{
			align : L6R1HPV18AlignImported.get(),
			fasta : hpv18Ref.get()
		});
		try
		{
			await testL6R1HPV18AlignImportedLinking();
		}
		catch(err)
		{
			console.log("bam linking threw exception");
			return reject();
		}

		console.log("Importing sequence alignment map from L6R1 HPV16 alignment");
		atomic.addOperation("inputBamFile",{
			bamPath : getSam(L6R1HPV16Align.get())
		});
		try
		{
			await testL6R1HPV16AlignImportedImporting();
		}
		catch(err)
		{
			console.log("sam importing threw exception");
			return reject();
		}

		console.log("Linking imported L6R1 HPV16 sequence alignment map to HPV16");
		atomic.addOperation("linkRefSeqToAlignment",{
			align : L6R1HPV16AlignImported.get(),
			fasta : hpv16Ref.get()
		});
		try
		{
			await testL6R1HPV16AlignImportedLinking();
		}
		catch(err)
		{
			console.log("sam linking threw exception");
			return reject();
		}

		console.log("Importing sequence alignment map from L6R1 HPV18 alignment");
		atomic.addOperation("inputBamFile",{
			bamPath : getSam(L6R1HPV18Align.get())
		});
		try
		{
			await testL6R1HPV18AlignImportedImporting();
		}
		catch(err)
		{
			console.log("sam importing threw exception "+err);
			return reject();
		}

		console.log("Linking imported L6R1 HPV18 sequence alignment map to HPv18");
		atomic.addOperation("linkRefSeqToAlignment",{
			align : L6R1HPV18AlignImported.get(),
			fasta : hpv18Ref.get()
		});
		try
		{
			await testL6R1HPV18AlignImportedLinking();
		}
		catch(err)
		{
			console.log("sam linking threw exception");
			return reject();
		}

		console.log("Importing headerless sequence alignment map");
		atomic.addOperation("inputBamFile",{
			bamPath : "data/L6R1HPV16NoHeader.sam"
		});
		try
		{
			await testL6R1HPV16AlignImportedImporting();
		}
		catch(err)
		{
			console.log("importing headerless sam threw (expected) exception "+err);
		}

		console.log("Importing headerless sequence aligment map with ref seq")
		atomic.addOperation("inputBamFile",{
			bamPath : "data/L6R1HPV16NoHeader.sam",
			fasta : hpv16Ref.get()
		});
		try
		{
			await testL6R1HPV16AlignImportedImporting();
		}
		catch(err)
		{
			console.log("importing headerless sam with ref seq threw exception "+err);
			return reject();
		}

		console.log("Starting to align L6R7R1, L6R7R2 against hpv16");
		atomic.addOperation(
			"runAlignment",
			{
				fasta : hpv16Ref.get(),
				fastq1 : L6R7R1.get(),
				fastq2 : L6R7R2.get()
			}
		);
		try
		{
			await testL6R7HPV16Alignment();
		}
		catch(err)
		{
			console.log("test alignment threw exception");
			return reject();
		}

		console.log("Rendering coverage track for L6R7 alignment against HPV16")
		try
		{
			await testL6R7HPV16CoverageTrackRenderer();
		}
		catch(err)
		{
			console.log("coverage track rendering threw exception");
			return reject();
		}

		console.log("Rendering SNP track for L6R7 alignment against HPV16")
		try
		{
			await testL6R7HPV16SNPTrackRenderer();
		}
		catch(err)
		{
			console.log("SNP track rendering threw exception");
			return reject();
		}

		console.log("Compiling coverage track for L6R7 alignment against HPV16");
		try
		{
			await testL6R7HPV16CoverageTrackCompilation();
		}
		catch(err)
		{
			console.log("Coverage track compilation threw exception");
			return reject();
		}

		console.log("Compiling SNP track for L6R7 alignment against HPV16");
		try
		{
			await testL6R7HPV16SNPTrackCompilation();
		}
		catch(err)
		{
			console.log("SNP track compilation threw exception");
			return reject();
		}

		/*console.log("BLASTing segment 0-1000 of L6R1 alignment on HPV16");
		atomic.addOperation("BLASTSegment",{
			align : L6R1HPV16Align.get(),
			contigUUID : L6R1HPV16Align.get().fasta.contigs[0].uuid,
			start : 0,
			stop : 1000
		});
		try
		{
			await testBLASTSegment0To1000L6R1HPV16Alignment();
		}
		catch(err)
		{
			console.log("BLASTing segment threw exception");
			return reject();
		}*/

		/*console.log("BLASTing segment 3500-4500 of L6R1 alignment on HPV16");
		atomic.addOperation("BLASTSegment",{
			align : L6R1HPV16Align.get(),
			contigUUID : L6R1HPV16Align.get().fasta.contigs[0].uuid,
			start : 3500,
			stop : 4500
		});
		try
		{
			await testBLASTSegment3500To4500L6R1HPV16Alignment();
		}
		catch(err)
		{
			console.log("BLASTing segment threw exception");
			return reject();
		}*/

		console.log("BLASTing segment 5-10 of L6R7 alignment on HPV16");
		atomic.addOperation("BLASTSegment",{
			align : L6R7HPV16Align.get(),
			contigUUID : L6R7HPV16Align.get().fasta.contigs[0].uuid,
			start : 5,
			stop : 10
		});
		try
		{
			await testBLASTSegment5To10L6R7HPV16Alignment();
		}
		catch(err)
		{
			console.log("BLASTing segment threw exception");
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

		L6R7R1.loadNoSpaces();
		L6R7R2.loadNoSpaces();

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

		L6R7R1.loadSpaces();
		L6R7R2.loadSpaces();

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
