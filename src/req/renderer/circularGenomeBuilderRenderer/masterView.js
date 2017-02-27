var viewMgr = require('./../viewMgr');
let FastaContigLoader = require("./../circularGenome/fastaContigLoader");
let CircularGenomeMgr = require("./../circularGenomeMgr");

var addGenomeView = require("./genomeView");
module.exports.addView = function(arr,div,model)
{
    arr.push
    (
        new class extends viewMgr.View
        {
            constructor()
            {
                super("masterView",div,model);
                this.views = new Array();
                this.firstRender = true;
                this.leftPanelOpen = false;
                this.rightPanelOpen = false;
                this.circularGenomes = new Array();
                this.genomeWriters = new Array();
                this.circularGenomeMgr = model;
            }
            onMount()
            {
                addGenomeView.addView(this.views,"genomeView");
                for(let i = 0; i != this.views.length; ++i)
                {
                    this.views[i].onMount();
                }
            }
            onUnMount()
            {
                for(let i = 0; i != this.views.length; ++i)
                {
                    this.views[i].onUnMount();
                }
            }
            renderView()
            {
                if(this.firstRender)
                {
                    this.leftPanelOpen = false;
                    this.rightPanelOpen = false;
                    this.firstRender = false;
                    return `
                        <button id="leftPanel" class="leftSlideOutPanel">Left Panel</button>
                        <button id="rightPanel" class="rightSlideOutPanel">Right Panel</button>
                        <div id="rightSlideOutPanel" class="rightSlideOutPanel">
                        </div>
                        <div id="leftSlideOutPanel" class="leftSlideOutPanel">
                        ${
                        (
                            ()=>
                            {
                                let res = "\n";
                                if(this.fastaInputs)
                                {
                                    for(let i = 0; i != this.fastaInputs.length; ++i)
                                    {
                                        if(this.fastaInputs[i].checked)
                                        {
                                            res += `<div id ="${this.fastaInputs[i].validID}">
                                                        <h3>${this.fastaInputs[i].alias}</h3>
                                                        <button id="${this.fastaInputs[i].validID}_newFigure" style="float:right;">New Figure</button>
                                                `;
                                            for(let k = 0; k != this.circularGenomeMgr.managedFastas.length; ++k)
                                            {
                                                if(this.circularGenomeMgr.managedFastas[k].name == this.fastaInputs[i].name)
                                                {
                                                    for(let j = 0; j != this.circularGenomeMgr.managedFastas[k].circularFigures.length; ++j)
                                                    {
                                                        res += `<input type="radio" id="${j}" name="selectedFigure" /><p>${this.circularGenomeMgr.managedFastas[k].circularFigures[j].name}</p>`;
                                                    }
                                                    break;
                                                }
                                            }
                                            res += `</div>`;
                                        }
                                    }
                                }
                                return res;
                            }
                        )()}
                        </div>
                    `;
                }
                for(let i = 0; i != this.views.length; ++i)
                {
                    this.views[i].render();
                }
            }
            postRender(){}
            dataChanged()
            {
                this.firstRender = true;
                for(let i = 0; i != this.fastaInputs.length; ++i)
                {
                    if(!this.circularGenomeMgr.isCached(this.fastaInputs[i]))
                        this.circularGenomeMgr.cacheFasta(this.fastaInputs[i]);
                }
                /*
                let genomeIndex = -1;
                for(let i = 0; i != this.circularGenomes.length; ++i)
                {
                    if(this.circularGenomes[i].alias == this.fastaInput.alias)
                    {
                        genomeIndex = i;
                        break;
                    }
                }
                if(genomeIndex == -1)
                {
                    this.genomeWriters.push(new FastaContigLoader());
                    genomeIndex = this.genomeWriters.length - 1;
                }
                let self = this;
                this.genomeWriters[genomeIndex].on
                (
                    "doneLoadingContigs",function()
                    {
                        self.doneLoadingContig(genomeIndex);
                    }
                );
                this.genomeWriters[genomeIndex].beginRefStream(this.fastaInput.name);*/
            }
            doneLoadingContig(genomeIndex)
            {
                viewMgr.getViewByName("genomeView",this.views).genome = this.genomeWriters[genomeIndex];
                this.render();
            }
            divClickEvents(event)
            {
                let me = this;
                if(event.target.id == "rightPanel")
                {
                    $("#rightSlideOutPanel").animate
                    (
                        {
                            "margin-right" : 
                            (
                                function()
                                {
                                    if(!me.rightPanelOpen)
                                    {
                                        me.rightPanelOpen = true;
                                        return "+=50%";
                                    }
                                    if(me.rightPanelOpen)
                                    {
                                        me.rightPanelOpen = false;
                                        return "-=50%";
                                    }
                                }
                            )()
                        }
                    );
                }
                if(event.target.id == "leftPanel")
                {
                    $("#leftSlideOutPanel").animate
                    (
                        {
                            "margin-left" : 
                            (
                                function()
                                {
                                    if(!me.leftPanelOpen)
                                    {
                                        me.leftPanelOpen = true;
                                        return "+=50%";
                                    }
                                    if(me.leftPanelOpen)
                                    {
                                        me.leftPanelOpen = false;
                                        return "-=50%";
                                    }
                                }
                            )()
                        }
                    );
                }
                for(let i = 0; i != this.fastaInputs.length; ++i)
                {
                    if(event.target.id == this.fastaInputs[i].validID+"_newFigure")
                    {
                        if(this.circularGenomeMgr.isCached(this.fastaInputs[i]))
                        {
                            for(let k = 0; k != this.circularGenomeMgr.managedFastas.length; ++k)
                            {
                                if(this.circularGenomeMgr.managedFastas[k].name == this.fastaInputs[i].name)
                                {
                                    this.circularGenomeMgr.managedFastas[k].circularFigures.push
                                    (
                                        new CircularGenomeMgr.circularFigure("New Figure",this.circularGenomeMgr.managedFastas[i].contigs)
                                    );
                                    this.circularGenomeMgr.postManagedFastas();
                                    return;
                                }
                            }
                        }
                    }
                }
                let parentID = event.target.parentElement.id;
                for(let i = 0; i != this.fastaInputs.length; ++i)
                {
                    if(parentID == this.fastaInputs[i].validID)
                    {

                    }
                }
            }
        }
    );
}