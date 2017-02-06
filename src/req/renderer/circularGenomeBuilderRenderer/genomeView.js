var viewMgr = require('./../viewMgr');
let CircularGenomeWriter = require("./../circularGenome/circularGenomeWriter");
let plasmidTrack = require("./../circularGenome/plasmidTrack");
let plasmid = require("./../circularGenome/plasmid");
let trackLabel = require("./../circularGenome/trackLabel");
module.exports.addView = function(arr,div,models)
{
    arr.push
    (
        new class extends viewMgr.View
        {
            constructor()
            {
                super("genomeView",div,models);
            }
            onMount(){}
            onUnMount(){}
            renderView()
            {
                if(this.genome)
                {
                    let totalBP = 0;
                    for(let i = 0; i != this.genome.contigs.length; ++i)
                    {
                        totalBP += this.genome.contigs[i].bp;
                    }
                  /*  return `
                        ${
                            (
                                ()=>
                                {
                                    let res = plasmid.add
                                    (
                                        {

                                        }
                                    )
                                }
                            )()
                        }
                    `;*/
                    return `
                        ${
                            plasmid.add
                            (
                                {
                                    sequenceLength : totalBP.toString(),
                                    plasmidHeight : "300",
                                    plasmidWidth : "300"
                                }
                            )
                            
                        }
                            ${
                                plasmidTrack.add
                                (
                                    {
                                        trackStyle : "fill:#f0f0f0;stroke:#ccc",
                                        radius : "120"
                                    }
                                )
                            }
                            ${plasmidTrack.end()}
                        ${plasmid.end()}
                    `;
                }
            }
            postRender(){}
            dataChanged(){}
            divClickEvents(event){}
        }
    );
}