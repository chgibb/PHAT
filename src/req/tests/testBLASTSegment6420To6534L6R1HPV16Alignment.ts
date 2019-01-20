import * as atomic from "./../operations/atomicOperations";
import {BLASTSegment} from "./../operations/BLASTSegment";
import {getBLASTReadResults,getBLASTFragmentResults} from "./../BLASTSegmentResult";

export async function testBLASTSegment6420To6534L6R1HPV16Alignment() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomic.updates.on("BLASTSegment",async function(op : BLASTSegment){
            if(op.progressMessage && !/x/.exec(op.progressMessage))
                console.log(op.progressMessage);

            if(op.flags.failure)
            {
                console.log("failed to BLAST segment");
                console.log(await atomic.getLogContent(op.logRecord)); 
                return reject();
            }

            else if(op.flags.success)
            {
                let readResults = await getBLASTReadResults(op.blastSegmentResult);
                if(readResults.length == 1)
                    console.log(`BLAST segment has correct number of results in whole file`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord));
                     return reject();
                }
                
                if(readResults[0].readWithFragments.read.SEQ == "TTAATAGGGCTGGTGCTGTTGGTGAAAATGTACCAGACGATTTATACATTAAAGGCTCTGGGTCTACTGCAAATTTAGCCAGTTCAAATTATTTTCCTACACCTAGTGAGATCGGAAGAGCACACGTCTGAACTCCAGTCACCGATGTATC")
                    console.log(`First read has correct sequence`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(readResults[0].readWithFragments.read.POS == 6420)
                    console.log(`First read has correct start position`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(!readResults[0].results.noHits)
                    console.log(`First read had hits`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(readResults[0].readWithFragments.fragments.length == 2)
                    console.log(`First read has correct number of fragments`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(readResults[0].readWithFragments.fragments[0].type == "mapped")
                    console.log(`First read, first fragment has correct type`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(readResults[0].readWithFragments.fragments[0].seq == "TTAATAGGGCTGGTGCTGTTGGTGAAAATGTACCAGACGATTTATACATTAAAGGCTCTGGGTCTACTGCAAATTTAGCCAGTTCAAATTATTTTCCTACACCTAGTG")
                    console.log(`First read, first fragment has correct sequence`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(readResults[0].readWithFragments.fragments[1].type == "unmapped")
                    console.log(`First read, second fragment has correct type`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(readResults[0].readWithFragments.fragments[1].seq == "AGATCGGAAGAGCACACGTCTGAACTCCAGTCACCGATGTATC")
                    console.log(`First read, second fragment has correct sequence`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }


                let fragmentResults = await getBLASTFragmentResults(op.blastSegmentResult);
                
                if(fragmentResults.length == 1)
                    console.log(`BLAST segment has correct number of fragments`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(fragmentResults[0].seq == "AGATCGGAAGAGCACACGTCTGAACTCCAGTCACCGATGTATC")
                    console.log(`First fragment has correct sequence`);
                else 
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(!fragmentResults[0].results.noHits)
                    console.log(`First fragment had hits`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(fragmentResults[0].readuuid == readResults[0].uuid)
                    console.log(`First fragment is from first read`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }

                return resolve();
            }
        });
    });
}