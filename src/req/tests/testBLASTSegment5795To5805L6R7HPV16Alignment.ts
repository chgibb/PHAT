import * as atomic from "./../operations/atomicOperations";
import {BLASTSegment} from "./../operations/BLASTSegment";
import {getBLASTReadResults,getBLASTFragmentResults} from "./../BLASTSegmentResult";

export async function testBLASTSegment5795To5805L6R7HPV16Alignment() : Promise<void>
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
                if(readResults.length == 2)
                    console.log(`BLAST segment has correct number of results in whole file`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(readResults[0].readWithFragments.read.SEQ == "AAAAACCTAACAATAACAAAATATTAGTTCCTAAAGTATCAGGATTACAATACAGGGTATTTAGAATACATTTACCTGACCCCAATAAGTTTGGTTTTCCTGACACCTCAAGATCGGAAAGCACACGACTGAACTCCAGTCACAGTCAACA")
                    console.log(`First read has correct sequence`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(readResults[0].readWithFragments.read.POS == 5796)
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
                
                if(readResults[0].readWithFragments.fragments[0].seq == "AAAAACCTAACAATAACAAAATATTAGTTCCTAAAGTATCAGGATTACAATACAGGGTATTTAGAATACATTTACCTGACCCCAATAAGTTTGGTTTTCCTGACACCTCA")
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
                
                if(readResults[0].readWithFragments.fragments[1].seq == "AGATCGGAAAGCACACGACTGAACTCCAGTCACAGTCAACA")
                    console.log(`First read, second fragment has correct sequence`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                

                if(readResults[1].readWithFragments.read.SEQ == "CGAGATCTACACTCTTTCCCTACACGACGCTCTTCCGATCTAAAAACCTAACAATAACAAAATATTAGTTCCTAAAGTATCAGGATTACAATACAGGGTATTTAGAATACATTTACCTGACCCCAATAAGTTTGGTTTTCCTGACACCTCA")
                    console.log(`Second read has correct sequence`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(readResults[1].readWithFragments.read.POS == 5796)
                    console.log(`Second read has correct start position`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(!readResults[1].results.noHits)
                    console.log(`Second read had hits`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(readResults[1].readWithFragments.fragments.length == 2)
                    console.log(`Second read has correct number of fragments`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(readResults[1].readWithFragments.fragments[0].type == "unmapped")
                    console.log(`Second read, first fragment has correct type`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(readResults[1].readWithFragments.fragments[0].seq == "CGAGATCTACACTCTTTCCCTACACGACGCTCTTCCGATCT")
                    console.log(`Second read, first fragment has correct sequence`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(readResults[1].readWithFragments.fragments[1].type == "mapped")
                    console.log(`Second read, second fragment has correct type`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(readResults[1].readWithFragments.fragments[1].seq == "AAAAACCTAACAATAACAAAATATTAGTTCCTAAAGTATCAGGATTACAATACAGGGTATTTAGAATACATTTACCTGACCCCAATAAGTTTGGTTTTCCTGACACCTCA")
                    console.log(`Second read, second fragment has correct sequence`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }


                let fragmentResults = await getBLASTFragmentResults(op.blastSegmentResult);
                
                if(fragmentResults.length == 2)
                    console.log(`BLAST segment has correct number of fragments`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(fragmentResults[0].seq == "AGATCGGAAAGCACACGACTGAACTCCAGTCACAGTCAACA")
                    console.log(`First fragment has correct sequence`);
                else 
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(fragmentResults[0].results.noHits)
                    console.log(`First fragment had no hits`);
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


                if(fragmentResults[1].seq == "CGAGATCTACACTCTTTCCCTACACGACGCTCTTCCGATCT")
                    console.log(`Second fragment has correct sequence`);
                else 
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(!fragmentResults[1].results.noHits)
                    console.log(`Second fragment had hits`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(fragmentResults[1].readuuid == readResults[1].uuid)
                    console.log(`Second fragment is from second read`);
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