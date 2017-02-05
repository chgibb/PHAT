var viewMgr = require('./../viewMgr');
let CircularGenomeWriter = require("./../circularGenome/circularGenomeWriter");
let plasmidTrack = require("./circularGenome/plasmidTrack");
let plasmid = require("./circularGenome/plasmid");
let trackLabel = require("./circularGenome/trackLabel");
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
                    return `
                        ${this.genome.contigs[0].name}
                    `;
                }
            }
            postRender(){}
            dataChanged(){}
            divClickEvents(event){}
        }
    );
}