var viewMgr = require('./../viewMgr');
var id = require('./../MakeValidID');
module.exports  = function(arr,div,model)
{
    arr.push
    (
        new class extends viewMgr.View
        {
            constructor()
            {
                super('report',div,model);
                this.data.fastqInputs = new Array();
                this.data.fastaInputs = new Array();


                this.data.selectedFastqs = new Array();
                this.data.selectedFasta = "";

                this.data.tab = "path";

                //view for confirm options
                this.data.confirmOptions = new class extends viewMgr.View
                {
                    constructor()
                    {
                        super('confirmOptions', 'confirmOptions');
                        this.data.selectedFastqs = new Array();
                        this.data.selectedFasta = "";
                    }
                    renderView()
                    {
                        var html = new Array();
                        if(this.data.selectedFastqs && this.data.selectedFasta)
                        {
                            html.push
                            (
                                "<p>Align <b>",this.data.selectedFastqs[0],"</b>,<b> ",this.data.selectedFastqs[1],"</b></p>",
                                "<p>Against <b>",this.data.selectedFasta,"</b></p>"
                            );
                        }
                        return html.join('');
                    }
                    onMount(){}
                    onUnMount(){}
                    postRender(){}
                    divClickEvents(event){}
                    dataChanged(){}
                }
            }
            onMount(){}
            onUnMount(){}
            renderView()
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
                for(let i = 0; i != this.data.fastqInputs.length; ++i)
                {
                    if(this.data.fastqInputs[i].checked)
                    {
                        html.push
                        (
                            "<tr>",
                            "<td>",this.data.fastqInputs[i].alias,"</td>",
                            "<td>","<input type='checkbox' id='",this.data.fastqInputs[i].validID,"'></input></td>",
                            "</tr>"
                        );
                    }
                }
                html.push("</table></div><br /><br />");

                html.push("<img id='pathTab' src='img/browseButton.png'>");
                html.push("<img id='hostTab' src='img/buttonHost.png'>");
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
                for(let i = 0; i != this.data.fastaInputs.length; ++i)
                {
                    if(this.data.fastaInputs[i].indexed &&
                    this.data.fastaInputs[i].type == this.data.tab &&
                    this.data.fastaInputs[i].checked)
                    {
                        html.push
                        (
                            "<tr>",
                            "<td>",this.data.fastaInputs[i].alias,"</td>",
                            "<td>","<input type='radio' name='fasta' id='",this.data.fastaInputs[i].validID,"'></input></td>",
                            "</tr>"
                        );
                    }
                }

                //div for confirmOptions view
                html.push("</table></div>");
                html.push("<div id='confirmOptions'></div>");
                html.push("<img id='alignButton' src='img/temporaryAlignButton.png'>");
                return html.join('');
            }
            postRender()
            {
                //restore checked state of checkboxs
                for(let i = 0; i != this.data.selectedFastqs.length; ++i)
                {
                    var elem = document.getElementById(this.data.selectedFastqs[i]);
                    if(elem)
                        elem.checked = true;
                }
                var elem = document.getElementById(this.data.selectedFasta);
                if(elem)
                    elem.checked = true;
                $("#fastqs").css("height",$(window).height()/3+"px");
                $("#fastas").css("height",$(window).height()/5+"px");

                this.data.confirmOptions.render();
            }
            divClickEvents(object)
            {
                if(!event || !event.target || !event.target.id)
                    return;
                for(let i = 0; i != this.data.fastqInputs.length; ++i)
                {
                    if(event.target.id == this.data.fastqInputs[i].validID)
                    {
                        if(this.data.selectedFastqs.length >= 2)
                            document.getElementById(event.target.id).checked = false;
                        this.populateSelectedFastqs();
                    }
                }
                if(event.target.id == "pathTab")
                {
                    this.data.tab = "path";
                }
                if(event.target.id == "hostTab")
                {
                    this.data.tab = "host";
                }
                if(event.target.id == "alignButton")
                {
                    var selected_fastq_count = 0;
                    for(let i = 0; i != this.data.fastqInputs.length; ++i)
                    {
                        if(this.data.selectedFastqs[0] == this.data.fastqInputs[i].validID)
                        {
                            this.data.selectedFastqs[0] = this.data.fastqInputs[i];
                            selected_fastq_count++;
                        }
                        if(this.data.selectedFastqs[1] == this.data.fastqInputs[i].validID)
                        {
                            this.data.selectedFastqs[1] = this.data.fastqInputs[i];
                            selected_fastq_count++;
                            break;
                        }
                    }
                    for(let i = 0; i != this.data.fastaInputs.length; ++i)
                    {
                        if(this.data.selectedFasta == this.data.fastaInputs[i].validID)
                        {
                            this.data.selectedFasta = this.data.fastaInputs[i];
                            break;
                        }
                    }

                    /*
                        Only run the alignment (bowtie2) if two fastQ's have been selected, 
                        AND a Fasta has been selected.
                    */
                    if (this.data.selectedFasta != "" && selected_fastq_count >= 2) {
                        alert("P.H.A.T will now align your selection.\nThis may take a few minutes.")
                        this.model.runAlignment(this.data.selectedFastqs,this.data.selectedFasta,this.data.tab);
                    } else {
                        alert(selected_fastq_count >= 2 ? "You need to select a Fasta file!" : "You need to select two FastQ files!");
                    }
                }
                this.populateSelectedFasta();
                this.populateSelectedFastqs();

                this.setConfirmOptions();

                viewMgr.render();
            }
            populateSelectedFastqs()
            {
                this.data.selectedFastqs = new Array();
                //walk the table and save checked fastqs in selectedFastqs
                for(let i = 0; i != this.data.fastqInputs.length; ++i)
                {
                    if(this.data.fastqInputs[i].checked &&
                    document.getElementById(this.data.fastqInputs[i].validID).checked)
                    {
                        this.data.selectedFastqs.push(this.data.fastqInputs[i].validID);
                    }
                    if(this.data.selectedFastqs.length >= 2)
                        break;
                }
            }
            populateSelectedFasta()
            {
                this.data.selectedFasta = "";
                //walk the table and save checked fasta in selectedFasta
                for(let i = 0; i != this.data.fastaInputs.length; ++i)
                {
                    var elem = document.getElementById(this.data.fastaInputs[i].validID);
                    if(elem && elem.checked)
                    {
                        this.data.selectedFasta = this.data.fastaInputs[i].validID;
                        return;
                    }
                }
            }
            setConfirmOptions()
            {
                //set confirmOptions' selected arrays to be equal to this' selected arrays
                //this.data.confirmOptions.data.selectedFastqs = this.data.selectedFastqs;
                //this.data.confirmOptions.data.selectedFasta = this.data.selectedFasta;
                var setFirst = false;
                var setSecond = false;
                //Selected items are saved by validID. Convert to alias for confirmOptions to render.
                for(let i = 0; i != this.data.fastqInputs.length; ++i)
                {
                    if(this.data.fastqInputs[i].checked)
                    {
                        if(this.data.selectedFastqs[0] == this.data.fastqInputs[i].validID)
                        {
                            this.data.confirmOptions.data.selectedFastqs[0] = this.data.fastqInputs[i].alias;
                            setFirst = true;
                        }
                        if(this.data.selectedFastqs[1] == this.data.fastqInputs[i].validID)
                        {
                            this.data.confirmOptions.data.selectedFastqs[1] = this.data.fastqInputs[i].alias;
                            setSecond = true;
                        }
                        if(setSecond && setFirst)
                            break;
                    }
                }
                for(let i = 0; i != this.data.fastaInputs.length; ++i)
                {
                    if(this.data.fastaInputs[i].checked)
                    {
                        if(this.data.selectedFasta == this.data.fastaInputs[i].validID)
                        {
                            this.data.confirmOptions.data.selectedFasta = this.data.fastaInputs[i].alias;
                            break;
                        }
                    }
                }
            }
        }
    );
}
