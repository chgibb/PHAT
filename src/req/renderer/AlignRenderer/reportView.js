var view = require('./..//view');
var id = require('./..//MakeValidID');
module.exports  = function(arr,div)
{
    arr.push
    (
        new class extends view.View
        {
            constructor()
            {
                super('report',div);
                this.data.fastqInputs = new Array();
                this.data.fastaInputs = new Array();


                this.data.selectedFastqs = new Array();
                this.data.selectedFasta = "";

                this.data.tab = "path";
                        
                //view for confirm options
                this.data.confirmOptions = new class extends view.View
                {
                    constructor()
                    {
                        super('confirmOptions', 'confirmOptions');
                        this.data.selectedFastqs = new Array();
                        this.data.selectedFasta = "";
                    }
                    renderView(parentView)
                    {
                        var html = new Array();
                        if(parentView.data.selectedFastqs && parentView.data.selectedFasta)
                        {
                            html.push
                            (
                                "<p>Align <b>",parentView.data.selectedFastqs[0],"</b>,<b> ",parentView.data.selectedFastqs[1],"</b></p>",
                                "<p>Against <b>",parentView.data.selectedFasta,"</b></p>"
                            );
                        }
                        return html.join('');
                    }
                    onMount(){}
                    onUnMount(){}
                    postRender(parentView){}
                    divClickEvents(parentView,event){}
                    dataChanged(parentView){}
                }
            }
            onMount(){}
            onUnMount(){}
            renderView(parentView)
            {
                var html = new Array();
                //fastq table
                html.push
                (
                    "<div id='fastqs' style='overflow-y:scroll;height:100px;border : 1px solid black;background-color : rgba(163, 200, 255, 1);'>",
                    "<table style='width:100%'>",
                    "<tr>",
                    "<th>Name</th>",
                    "<th>Use</th>",
                    "</tr>"
                );
                for(let i = 0; i != parentView.data.fastqInputs.length; ++i)
                {
                    if(parentView.data.fastqInputs[i].checked)
                    {
                        html.push
                        (
                            "<tr>",
                            "<td>",parentView.data.fastqInputs[i].alias,"</td>",
                            "<td>","<input type='checkbox' id='",parentView.data.fastqInputs[i].validID,"'></input></td>",
                            "</tr>"
                        );
                    }
                }
                html.push("</table></div><br /><br />");

                html.push("<img id='pathTab' src='../img/pathoButton.png'>");
                html.push("<img id='hostTab' src='../img/browseButton.png'>");
                //fasta table
                html.push
                (
                    "<div id='fastas' style='overflow-y:scroll;height:100px;border : 1px solid black;background-color : rgba(163, 200, 255, 1);'>",
                    "<table style='width:100%'>",
                    "<tr>",
                    "<th>Name</th>",
                    "<th>Align Against</th>",
                    "</tr>"   
                );
                for(let i = 0; i != parentView.data.fastaInputs.length; ++i)
                {
                    if(parentView.data.fastaInputs[i].indexed &&
                    parentView.data.fastaInputs[i].type == parentView.data.tab &&
                    parentView.data.fastaInputs[i].checked)
                    {
                        html.push
                        (
                            "<tr>",
                            "<td>",parentView.data.fastaInputs[i].alias,"</td>",
                            "<td>","<input type='radio' name='fasta' id='",parentView.data.fastaInputs[i].validID,"'></input></td>",
                            "</tr>"
                        );
                    }
                }

                //div for confirmOptions view
                html.push("</table></div>");
                html.push("<div id='confirmOptions'></div>");
                html.push("<img id='alignButton' src='../img/browseButton.png'>");
                return html.join('');
            }
            postRender(parentView)
            {
                //restore checked state of checkboxs
                for(let i = 0; i != parentView.data.selectedFastqs.length; ++i)
                {
                    var elem = document.getElementById(parentView.data.selectedFastqs[i]);
                    if(elem)
                        elem.checked = true;
                }
                var elem = document.getElementById(parentView.data.selectedFasta);
                if(elem)
                    elem.checked = true;
                $("#fastqs").css("height",$(window).height()/3+"px");
                $("#fastas").css("height",$(window).height()/5+"px");

                parentView.data.confirmOptions.render(); 
            }
            divClickEvents(parentView,object)
            {
                if(!event || !event.target || !event.target.id)
                    return;
                for(let i = 0; i != parentView.data.fastqInputs.length; ++i)
                {
                    if(event.target.id == parentView.data.fastqInputs[i].validID)
                    {
                        if(parentView.data.selectedFastqs.length >= 2)
                            document.getElementById(event.target.id).checked = false;
                        parentView.populateSelectedFastqs(parentView);
                    }
                }
                if(event.target.id == "pathTab")
                {
                    parentView.data.tab = "path";
                }
                if(event.target.id == "hostTab")
                {
                    parentView.data.tab = "host";
                }
                if(event.target.id == "alignButton")
                {
                    for(let i = 0; i != parentView.data.fastqInputs.length; ++i)
                    {
                        if(parentView.data.selectedFastqs[0] == parentView.data.fastqInputs[i].validID)
                        {
                            parentView.data.selectedFastqs[0] = parentView.data.fastqInputs[i];
                        }
                        if(parentView.data.selectedFastqs[1] == parentView.data.fastqInputs[i].validID)
                        {
                            parentView.data.selectedFastqs[1] = parentView.data.fastqInputs[i];
                            break;
                        }
                    }
                    for(let i = 0; i != parentView.data.fastaInputs.length; ++i)
                    {
                        if(parentView.data.selectedFasta == parentView.data.fastaInputs[i].validID)
                        {
                            parentView.data.selectedFasta = parentView.data.fastaInputs[i];
                            break;
                        }
                    }

                    align.runAlignment(parentView.data.selectedFastqs,parentView.data.selectedFasta,parentView.data.tab);
                }
                parentView.populateSelectedFasta(parentView);
                parentView.populateSelectedFastqs(parentView);
                                    
                parentView.setConfirmOptions(parentView);

                render();
            }
            populateSelectedFastqs(parentView)
            {
                parentView.data.selectedFastqs = new Array();
                //walk the table and save checked fastqs in selectedFastqs
                for(let i = 0; i != parentView.data.fastqInputs.length; ++i)
                {
                    if(parentView.data.fastqInputs[i].checked &&
                    document.getElementById(parentView.data.fastqInputs[i].validID).checked)
                    {
                        parentView.data.selectedFastqs.push(parentView.data.fastqInputs[i].validID);
                    }
                    if(parentView.data.selectedFastqs.length >= 2)
                        break;
                }
            }
            populateSelectedFasta(parentView)
            {
                parentView.data.selectedFasta = "";
                //walk the table and save checked fasta in selectedFasta
                for(let i = 0; i != parentView.data.fastaInputs.length; ++i)
                {
                    var elem = document.getElementById(parentView.data.fastaInputs[i].validID);
                    if(elem && elem.checked)
                    {
                        parentView.data.selectedFasta = parentView.data.fastaInputs[i].validID;
                        return;
                    }
                }
            }
            setConfirmOptions(parentView)
            {
                //set confirmOptions' selected arrays to be equal to this' selected arrays
                //parentView.data.confirmOptions.data.selectedFastqs = parentView.data.selectedFastqs;
                //parentView.data.confirmOptions.data.selectedFasta = parentView.data.selectedFasta;
                var setFirst = false;
                var setSecond = false;
                //Selected items are saved by validID. Convert to alias for confirmOptions to render.
                for(let i = 0; i != parentView.data.fastqInputs.length; ++i)
                {
                    if(parentView.data.fastqInputs[i].checked)
                    {
                        if(parentView.data.selectedFastqs[0] == parentView.data.fastqInputs[i].validID)
                        {
                            parentView.data.confirmOptions.data.selectedFastqs[0] = parentView.data.fastqInputs[i].alias;
                            setFirst = true;
                        }
                        if(parentView.data.selectedFastqs[1] == parentView.data.fastqInputs[i].validID)
                        {
                            parentView.data.confirmOptions.data.selectedFastqs[1] = parentView.data.fastqInputs[i].alias;
                            setSecond = true;
                        }
                        if(setSecond && setFirst)
                            break;
                    }
                }
                for(let i = 0; i != parentView.data.fastaInputs.length; ++i)
                {
                    if(parentView.data.fastaInputs[i].checked)
                    {
                        if(parentView.data.selectedFasta == parentView.data.fastaInputs[i].validID)
                        {
                            parentView.data.confirmOptions.data.selectedFasta = parentView.data.fastaInputs[i].alias;
                            break;
                        }
                    }
                }
            }
        }
    );
}