var viewMgr = require('./../viewMgr');
let CircularGenomeWriter = require("./../circularGenome/circularGenomeWriter");
let plasmidTrack = require("./../circularGenome/plasmidTrack");
let plasmid = require("./../circularGenome/plasmid");
let trackLabel = require("./../circularGenome/trackLabel");

require("angular");
require("angularplasmid");

let app = angular.module('myApp',['angularplasmid']);
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
                    //Remove the div this view is bound to
                    document.body.removeChild(document.getElementById(this.div));
                    $("#"+this.div).remove();

                    let totalBP = 0;
                    for(let i = 0; i != this.genome.contigs.length; ++i)
                    {
                        totalBP += this.genome.contigs[i].bp;
                    }
                    //This is an unholy mess adapted from the example given inline in the
                    //angular source code https://github.com/angular/angular.js/blob/master/src/auto/injector.js
                    //We remove the div this view is bound to, recreate it and re render the angular template into it
                    //Then we pass the div into angular to compile the templates and then finally inject it all back into
                    //the page
                    let $div = $
                    (
                        `<div id="${this.div}">
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
                                    ${
                                        trackLabel.add
                                        (
                                            {
                                                text : this.genome.contigs[0].name,
                                                labelStyle : "font-size:20px;font-weight:400"
                                            }
                                        )
                                    }
                                    ${trackLabel.end()}
                                ${plasmidTrack.end()}
                            ${plasmid.end()}
                        </div>
                    `);
                    $(document.body).append($div);
                    angular.element(document).injector().invoke
                    (
                        function($compile)
                        {
                            let scope = angular.element($div).scope();
                            $compile($div)(scope);
                        }
                    );

                }
            }
            postRender(){}
            dataChanged(){}
            divClickEvents(event){}
        }
    );
}