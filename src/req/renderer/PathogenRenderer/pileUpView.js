var pileUp = require('pileup');

var view = require('./../view.js');
var id = require('./../MakeValidID.js');
module.exports = function(arr,div)
{
    arr.push
    (
        new class extends view.View
        {
            constructor()
            {
                super('pileUp',div);
                this.report = "";
                this.viewer = {};
                this.selectedFastaInputs = new Array();
                this.aligns = new Array();
            }
            onMount()
            {   
                var twoBit;
                var refName;
                var bam;
                var bai;
                var bamName;
                var contig;
            
                refName = this.report.split(';')[2];

                for(let i = 0; i != this.selectedFastaInputs.length; ++i)
                {
                    if(this.selectedFastaInputs[i].UUID == refName)
                    {
                        twoBit = this.selectedFastaInputs[i].twoBit;
                        contig = this.selectedFastaInputs[i].contigs[0];
                        break;
                    }
                }

                for(let i = 0; i != this.aligns.length; ++i)
                {
                    if(this.aligns[i].UUID == this.report)
                    {   
                        bam = "rt/AlignmentArtifacts/"+this.report+"/out.sorted.bam";
                        bai = "rt/AlignmentArtifacts/"+this.report+"/out.sorted.bam.bai";
                        bamName = this.report.split(';')[0]+", "+this.report.split(';')[1];
                        break;
                    }
                }
                this.viewer = pileUp.create
                (
                    document.getElementById(this.div),
                    {
                        range  :
                        {
                            contig : contig,
                            start : 0,
                            stop : 100
                        },
                        tracks : 
                        [
                            {
                                viz : pileUp.viz.genome(),
                                isReference : true,
                                data : pileUp.formats.twoBit
                                (
                                    {
                                        url : twoBit
                                    }
                                ),
                                name : refName
                            },
                            {
                                viz : pileUp.viz.pileUp(),
                                data : pileUp.formats.bam
                                (
                                    {
                                        url : bam,
                                        indexUrl : bai
                                    }
                                ),
                                cssClass : 'normal',
                                name : bamName
                            }
                        ]
                    }
                );
            }
            onUnMount()
            {
                this.viewer.destroy();
            }
            renderView(parentView)
            {
                if(document.getElementById('pileUpIsOpen') || !this.report)
                {
                    return;
                }
                var html = "";
                html += "<br /><button id='goBack'>Go Back</button><br/>";
                
                html += "<div id='pileUpIsOpen></div>"; 
                return html;
            }
            postRender(parentView){}
            divClickEvents(parentView)
            {
                if(!event || !event.target || !event.target.id)
                    return;
                if(event.target.id == "goBack")
                {
                    parentView.report = "";
                    changeView('report');
                    return;
                }
            }
            dataChanged(parentView){}
        }
    );
}