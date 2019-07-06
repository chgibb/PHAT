import * as atomic from "./../operations/atomicOperations";
import * as L6R1HPV16Align from "./L6R1HPV16Align";
import * as L6R7HPV16Align from "./L6R7HPV16Align";
import {testBLASTSegment5795To5805L6R7HPV16Alignment} from "./testBLASTSegment5795To5805L6R7HPV16Alignment";
import {testBLASTSegment5To10L6R1HPV16Alignment} from "./testBLASTSegment5To10L6R1HPV16Alignment";
import {testBLASTSegment6420To6534L6R1HPV16Alignment} from "./testBLASTSegment6420To6534L6R1HPV16Alignment";

export async function runBLASTSegmentTests() : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => 
    {
        console.log("BLASTing segment 5-10 of L6R1 alignment on HPV16");
        atomic.addOperation("BLASTSegment",{
            align : L6R1HPV16Align.get(),
            start : 5,
            stop : 10
        });
        try
        {
            await testBLASTSegment5To10L6R1HPV16Alignment();
        }
        catch(err)
        {
            console.log("BLASTing segment threw exception");
            return reject();
        }

        console.log("BLASTing segment 6420-6534 of L6R1 alignment on HPV16");
        atomic.addOperation("BLASTSegment",{
            align : L6R1HPV16Align.get(),
            start : 6420,
            stop : 6534
        });
        try
        {
            await testBLASTSegment6420To6534L6R1HPV16Alignment();
        }
        catch(err)
        {
            console.log("BLASTing segment threw exception");
            return reject();
        }

        console.log("BLASTing segment 5795-5805 of L6R7 alignment on HPV16");
        atomic.addOperation("BLASTSegment",{
            align : L6R7HPV16Align.get(),
            start : 5795,
            stop : 5805
        });
        try
        {
            await testBLASTSegment5795To5805L6R7HPV16Alignment();
        }
        catch(err)
        {
            console.log("BLASTing segment threw exception");
            return reject();
        }
        return resolve();
    });
}