import * as path from "path";

import {getReadableAndWritable} from "./../../getAppPath";
import {get2BitPath} from "./../../fasta";
import {AlignData} from "./../../alignData";

let viewer : any;

export function showPileup(
    align : AlignData,
    contig : string,
    start : number,
    stop : number,
    div : string,
    pileup : any
) : void
{
    let twoBit : string;
    let refName : string;
    let bam : string;
    let bai : string;
    let bamName : string;
    
    twoBit = get2BitPath(align.fasta);

    bam = getReadableAndWritable("rt/AlignmentArtifacts/"+align.uuid+"/out.sorted.bam");
    bai = getReadableAndWritable("rt/AlignmentArtifacts/"+align.uuid+"/out.sorted.bam.bai");
    bamName = align.alias;

    viewer = pileup.create(
        document.getElementById(div),
        {
            range : {
                contig : contig,
                start : start,
                stop : stop
            },
            tracks : [
                {
                    viz : pileup.viz.genome(),
                    isReference : true,
                    data : pileup.formats.twoBit(
                        {
                            url : path.resolve(twoBit)
                        }
                    ),
                    name : refName
                },
                {
                    viz : pileup.viz.pileup(),
                    data : pileup.formats.bam(
                        {
                            url : path.resolve(bam),
                            indexUrl : path.resolve(bai)
                        }
                    ),
                    cssClass : "normal",
                    name : bamName
                }
            ]
        }
    );
    setTimeout(
        function(){
            window.dispatchEvent(new Event("resize"));
        },500
    );
}