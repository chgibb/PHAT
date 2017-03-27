var viewMgr = require('./../viewMgr');
var id = require('./../MakeValidID');
var contains = require('./../contains');
module.exports = function(arr,div)
{
    arr.push
    (
        new class extends viewMgr.View
        {
            constructor()
            {
                super('report', div);
                this.selectedFastaInputs = new Array();
                this.selectedFastqInputs = new Array();
                this.data.aligns = new Array();
            }
            onMount(){}
            onUnMount(){}
            renderView()
            {
                var html = new Array();
                html.push
                (
                    "<table style='width:100%;'>",
                    "<tr>",
                    "<th>Name</th>",
                    "<th>Reads</th>",
                    "<th>Mates</th>",
                    "<th>Overall Alignment Rate %</th>",
                    "<th>Date Ran</th>",
                    "</tr>"
                );
                for(let i = 0; i != this.data.aligns.length; ++i)
                {
                    if(this.data.aligns[i].type == "path")
                    {
                        var sources = this.data.aligns[i].UUID.split(';');
                        if
                        (
                            contains(this.selectedFastqInputs,sources[0]) &&
                            contains(this.selectedFastqInputs,sources[1]) &&
                            contains(this.selectedFastaInputs,sources[2])
                        )
                        {
                            html.push
                            (
                                "<tr>",
                                "<td><p id='",this.data.aligns[i].UUID,"' >",this.data.aligns[i].alias,"</p></td>",
                                "<td>",this.data.aligns[i].summary.reads,"</td>",
                                "<td>",this.data.aligns[i].summary.mates,"</td>",
                                "<td>",this.data.aligns[i].summary.overallAlignmentRate,"</td>",
                                "<td>",this.data.aligns[i].dateStampString,"</td>",
                                "</tr>"
                            )
                        }
                    }
                }
                html.push("</table>");
                return html.join('');
            }
            postRender(){}
            divClickEvents(event)
            {
                if(!event || !event.target || !event.target.id)
                    return;
                for(let i = 0; i != this.data.aligns.length; ++i)
                {
                    if(this.data.aligns[i].UUID == event.target.id)
                    {
                        //views[view.getIndexOfViewByName(views,"pileUp")].report = this.data.aligns[i].UUID;
                        viewMgr.getViewByName("pileUp").report = this.data.aligns[i].UUID;
                        viewMgr.changeView("pileUp");
                        return;
                    }
                }
            }
            dataChanged(){}

        }
        
    );
}