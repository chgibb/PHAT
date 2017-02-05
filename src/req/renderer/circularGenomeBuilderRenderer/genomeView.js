var viewMgr = require('./../viewMgr');
let CircularGenomeWriter = require("./../circularGenome/circularGenomeWriter");
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
                return `
                `;
            }
            postRender(){}
            dataChanged(){}
            divClickEvents(event){}
        }
    );
}