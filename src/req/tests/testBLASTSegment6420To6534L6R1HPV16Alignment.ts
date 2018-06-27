import * as atomic from "./../operations/atomicOperations";
import {BLASTSegment} from "./../operations/BLASTSegment";
import {getBLASTReadResults,getBLASTFragmentResults} from "./../BLASTSegmentResult";

export async function testBLASTSegment6420To6534L6R1HPV16Alignment() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomic.updates.on("BLASTSegment",async function(op : BLASTSegment){
            if(op.progressMessage)
            {
                console.log(op.progressMessage);
            }

            if(op.flags.failure)
            {
                console.log("failed to BLAST segment");
                return reject();
            }

            else if(op.flags.success)
            {
                let readResults = await getBLASTReadResults(op.blastSegmentResult,0,0);
                if(readResults.length == 2)
                    console.log(`BLAST segment has correct number of results in whole file`);
                else
                    return reject();
                
                if(readResults[0].readWithFragments.read.SEQ == "TTAATAGGGCTGGTGCTGTTGGTGAAAATGTACCAGACGATTTATACATTAAAGGCTCTGGGTCTACTGCAAATTTAGCCAGTTCAAATTATTTTCCTACACCTAGTGAGATCGGAAGAGCACACGTCTGAACTCCAGTCACCGATGTATC")
                    console.log(`First read has correct sequence`);
                else
                    return reject();
                
                if(readResults[0].readWithFragments.read.POS == 6420)
                    console.log(`First read has correct start position`);
                else
                    return reject();
                
                if(!readResults[0].results.noHits)
                    console.log(`First read had hits`);
                else
                    return reject();
                
                if(readResults[0].readWithFragments.fragments.length == 2)
                    console.log(`First read has correct number of fragments`);
                else
                    return reject();
                
                if(readResults[0].readWithFragments.fragments[0].type == "mapped")
                    console.log(`First read, first fragment has correct type`);
                else
                    return reject();
                
                if(readResults[0].readWithFragments.fragments[0].seq == "TTAATAGGGCTGGTGCTGTTGGTGAAAATGTACCAGACGATTTATACATTAAAGGCTCTGGGTCTACTGCAAATTTAGCCAGTTCAAATTATTTTCCTACACCTAGTG")
                    console.log(`First read, first fragment has correct sequence`);
                else
                    return reject();
                
                if(readResults[0].readWithFragments.fragments[1].type == "unmapped")
                    console.log(`First read, second fragment has correct type`);
                else
                    return reject();
                
                if(readResults[0].readWithFragments.fragments[1].seq == "AGATCGGAAGAGCACACGTCTGAACTCCAGTCACCGATGTATC")
                    console.log(`First read, second fragment has correct sequence`);
                else
                    return reject();


                if(readResults[1].readWithFragments.read.SEQ == "TTAATAGGGCTGGTGCTGTTGGTGAAAATGTACCAGACGATTTATACATTAAAGGCTCTGGGTCTACTGCAAATTTAGCCAGTTCAAATTATTTTCCTACACCTAGTGAGATCGGAAGAGCACACGTCTGAACTCCAGTCACCGATGTATC")
                    console.log(`Second read has correct sequence`);
                else
                    return reject();
                
                if(readResults[1].readWithFragments.read.POS == 6420)
                    console.log(`Second read has correct start position`);
                else
                    return reject();
                
                if(!readResults[1].results.noHits)
                    console.log(`Second read had hits`);
                else
                    return reject();
                
                if(readResults[1].readWithFragments.fragments.length == 2)
                    console.log(`Second read has correct number of fragments`);
                else
                    return reject();
                
                if(readResults[1].readWithFragments.fragments[0].type == "mapped")
                    console.log(`Second read, first fragment has correct type`);
                else
                    return reject();
                
                if(readResults[1].readWithFragments.fragments[0].seq == "TTAATAGGGCTGGTGCTGTTGGTGAAAATGTACCAGACGATTTATACATTAAAGGCTCTGGGTCTACTGCAAATTTAGCCAGTTCAAATTATTTTCCTACACCTAGTG")
                    console.log(`Second read, first fragment has correct sequence`);
                else
                    return reject();
                
                if(readResults[1].readWithFragments.fragments[1].type == "unmapped")
                    console.log(`Second read, second fragment has correct type`);
                else
                    return reject();
                
                if(readResults[1].readWithFragments.fragments[1].seq == "AGATCGGAAGAGCACACGTCTGAACTCCAGTCACCGATGTATC")
                    console.log(`Second read, second fragment has correct sequence`);
                else
                    return reject();


                let fragmentResults = await getBLASTFragmentResults(op.blastSegmentResult);
                
                if(fragmentResults.length == 2)
                    console.log(`BLAST segment has correct number of fragments`);
                else
                    return reject();
                
                if(fragmentResults[0].seq == "AGATCGGAAGAGCACACGTCTGAACTCCAGTCACCGATGTATC")
                    console.log(`First fragment has correct sequence`);
                else 
                    return reject();
                
                if(!fragmentResults[0].results.noHits)
                    console.log(`First fragment had hits`);
                else
                    return reject();
                
                if(fragmentResults[0].readuuid == readResults[0].uuid)
                    console.log(`First fragment is from first read`);
                else
                    return reject();
                
                if(fragmentResults[1].seq == "AGATCGGAAGAGCACACGTCTGAACTCCAGTCACCGATGTATC")
                    console.log(`Second fragment has correct sequence`);
                else
                    return reject();
                
                if(!fragmentResults[1].results.noHits)
                    console.log(`Second fragment had hits`);
                else
                    return reject();
                
                if(fragmentResults[1].readuuid == readResults[1].uuid)
                    console.log(`Second fragment is from second read`);
                else
                    return reject();

                return resolve();
            }
        });
    });
}