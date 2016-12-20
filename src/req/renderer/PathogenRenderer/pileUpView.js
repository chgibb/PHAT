

var viewMgr = require('./../viewMgr');
var id = require('./../MakeValidID.js');

var fsAccess = require('./../../fsAccess');
module.exports = function(arr,div)
{
    arr.push
    (
        new class extends viewMgr.View
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
                var pileUp = require('./pileup');
                var twoBit;
                var refName;
                var bam;
                var bai;
                var bamName;
                var contig;
            
                refName = this.report.split(";")[2];

                for(let i = 0; i != this.selectedFastaInputs.length; ++i)
                {
                    if(this.selectedFastaInputs[i].alias == refName)
                    {
                        twoBit = "resources/app/"+this.selectedFastaInputs[i].twoBit;
                        contig = this.selectedFastaInputs[i].contigs[0];
                        break;
                    }
                }

                for(let i = 0; i != this.aligns.length; ++i)
                {
                    if(this.aligns[i].UUID == this.report)
                    {   
                        bam = "resources/app/rt/AlignmentArtifacts/"+this.report+"/out.sorted.bam";
                        bai = "resources/app/rt/AlignmentArtifacts/"+this.report+"/out.sorted.bam.bai";
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
                                        url : fsAccess(twoBit)
                                    }
                                ),
                                name : refName
                            },
                            {
                                viz : pileUp.viz.pileup(),
                                data : pileUp.formats.bam
                                (
                                    {
                                        url : fsAccess(bam),
                                        indexUrl : fsAccess(bai)
                                    }
                                ),
                                cssClass : 'normal',
                                name : bamName
                            }
                        ]
                    }
                );
                var html = "";
                html += "<button id='goBack'>Go Back</button><br/>";
                
                document.getElementById("goBackDiv").innerHTML = html;
                var me = this;
                document.getElementById("goBack").addEventListener
                (
                    "click",
                    function(ev)
                    {
                        me.report = "";
                        viewMgr.changeView('report');
                    },
                    false
                );
                //fix a pileup.js bug where the reference track is hidden until a resize event.
                //Pileup's loading routines are all async, so wait a second and then trigger a resize to show the reference track.
                setTimeout
			    (
				    function()
				    {
					    window.dispatchEvent
					    (
						    new Event('resize')
					    );
				    },
				    1000
			    );
            }
            onUnMount()
            {
                this.viewer.destroy();
                document.getElementById("goBackDiv").innerHTML = "";
            }
            renderView(parentView)
            {
                return "";
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
