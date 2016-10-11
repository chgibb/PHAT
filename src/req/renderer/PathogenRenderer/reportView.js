var view = require('./../view');
var id = require('./../MakeValidID');
var contains = require('./../contains');
module.exports = function(arr,div)
{
    arr.push
    (
        new class extends view.View
        {
            constructor()
            {
                super('report', div);
                this.selectedFastaInputs = new Array();
                this.selectedFastqInputs = new Array();
                this.aligns = new Array();
            }
            onMount(){}
            onUnMount(){}
            renderView(parentView)
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
                for(var i in this.aligns)
                {
                    if(this.aligns[i].type == "path")
                    {
                        var sources = this.aligns[i].UUID.split(';');
                        if
                        (
                            contains.containsElement(this.selectedFastqInputs,sources[0]) &&
                            contains.containsElement(this.selectedFastqInputs,sources[1]) &&
                            contains.containsElement(this.selectedFastaInputs,sources[2])
                        )
                        {
                            html.push
                            (
                                "<tr>",
                                "<td><p id='",this.aligns[i].UUID,"' >",this.aligns[i].alias,"</p></td>",
                                "<td>",this.aligns[i].summary.reads,"</td>",
                                "<td>",this.aligns[i].summary.mates,"</td>",
                                "<td>",this.aligns[i].summary.overallAlignmentRate,"</td>",
                                "<td>",this.aligns[i].dateStampString,"</td>",
                                "</tr>"
                            )
                        }
                    }
                }
                html.push("</table>");
                return html.join('');
            }
            postRender(parentView){}
            divClickEvents(parentView,event)
            {
                changeView();
                if(!event || !event.target || !event.target.id)
                    return;
                for(let i = 0; i != this.aligns.length; ++i)
                {
                    
                }
            }
            dataChanged(parentView){}

        }
        
    );
}