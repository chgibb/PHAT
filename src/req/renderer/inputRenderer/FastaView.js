var view = require('./../view.js');
var id = require('./../MakeValidID.js');
var buildInclusiveSearchFilter = require('./../buildInclusiveSearchFilter.js');
module.exports = function(arr,div)
{
    arr.push
    (
        new class extends view.View
        {
            constructor()
            {
                super('fasta',div);
                this.data.fastaInputs = new Array();
                this.data.searchFilter = new RegExp("","i");
                this.data.filterString = "";
            }
            onMount(){}
            onUnMount(){}
            renderView(parentView)
            {
                if(document.getElementById('fastaInputFilterBox'))
                    parentView.data.filterString = document.getElementById('fastaInputFilterBox').value;
                var html = new Array();
                html.push
                (
                    "<img src='img/indexButton.png' style='margin-top:0px;' class='viewTab' id='indexButton'>",
                    "<input id='fastaInputFilterBox' style='margin-left:-255px;' class='inputFilterBox' type='text' autofocus='autofocus' placeholder='Search' />",
                    "<table style='width:100%'>",
                    "<tr>",
                    "<td><input type='checkbox' id='fastaSelectAllBox'></input></td>",
                    "<th>Reference Name</th>",
                    "<th>Directory</th>",
                    "<th>Size</th>",
                    "<th>Pathogen</th>",
                    "<th>Host</th>",
                    "<th>Indexed</th>",
                    "</tr>"
                );
                parentView.data.searchFilter = buildInclusiveSearchFilter(parentView.data.filterString);
                for(let i = 0; i != parentView.data.fastaInputs.length; ++i)
                {
                    if(parentView.data.searchFilter.test(parentView.data.fastaInputs[i].alias))
				    {
                        html.push
		                (
			                "<tr><td><input type='checkbox' id='",id.makeValidID(parentView.data.fastaInputs[i].name),"'></input></td>",
			                "<td id='",id.makeValidID(parentView.data.fastaInputs[i].name)+"_p","'>",parentView.data.fastaInputs[i].alias,"</td>",
			                "<td>",parentView.data.fastaInputs[i].name,"</td>",
			                "<td>",parentView.data.fastaInputs[i].sizeString,"</td>",
                            "<td>","<input type='radio' id='",id.makeValidID(parentView.data.fastaInputs[i].name)+"_path","' name='",id.makeValidID(parentView.data.fastaInputs[i].name),"'></input></td>",
                            "<td>","<input type='radio' id='",id.makeValidID(parentView.data.fastaInputs[i].name)+"_host","' name='",id.makeValidID(parentView.data.fastaInputs[i].name),"'></input></td>",
                            "<td>",parentView.data.fastaInputs[i].indexed,"</td>",
			                "</tr>"
		                );
                    }
                }
                html.push("</table>");
                return html.join('');
            }
            postRender(parentView)
            {
                if(parentView.data.filterString)
                    document.getElementById('fastaInputFilterBox').value = parentView.data.filterString;
                var shouldCheckCheckAllBox = true;
                for(let i = 0; i != parentView.data.fastaInputs.length; ++i)
                {
                    if(parentView.data.fastaInputs[i].checked)
                    {
                        $('#'+parentView.data.fastaInputs[i].validID).prop("checked",true);
                    }
                    if(parentView.data.fastaInputs[i].host)
                        $('#'+parentView.data.fastaInputs[i].validID+'_host').prop("checked",true);
                    if(parentView.data.fastaInputs[i].pathogen)
                        $('#'+parentView.data.fastaInputs[i].validID+'_path').prop("checked",true);
                    if(parentView.data.searchFilter.test(parentView.data.fastaInputs[i].alias))
                    {
                        if(!parentView.data.fastaInputs[i].checked)
                            shouldCheckCheckAllBox = false;
                    }
                }
                $('#fastaInputFilterBox').on
                (
                    'change keydown keyup paste',
                    function()
                    {
                        parentView.data.filterString = document.getElementById('fastaInputFilterBox').value;
                        parentView.render();
                    }
                );
                $('#fastaSelectAllBox').prop("checked",shouldCheckCheckAllBox);
                document.getElementById('fastaInputFilterBox').focus();
            }
            divClickEvents(parentView,event)
            {
                //potentially error or user clicked on something we're not interested in 
                if(!event || !event.target || !event.target.id)
                    return;
                //checkboxs are the most likely to be clicked
                if(event.target.id != 'fastaSelectAllBox')
                {
                    var name = id.findOriginalInput(event.target.id,parentView.data.fastaInputs);
                    //checkbox was clicked
                    if(name !== undefined)
                    {
                        if(event.target.checked)
                        {
                            for(let i = 0; i != parentView.data.fastaInputs.length; ++i)
                            {
                                if(parentView.data.fastaInputs[i].name == name)
                                {
                                    parentView.data.fastaInputs[i].checked = true;
                                    parentView.dataChanged();
                                    return;
                                }
                            }
                        }
                        if(!event.target.checked)
                        {
                            for(let i = 0; i != parentView.data.fastaInputs.length; ++i)
                            {
                                if(parentView.data.fastaInputs[i].name == name)
                                {
                                    parentView.data.fastaInputs[i].checked = false;
                                    parentView.dataChanged();
                                    return;
                                }
                            }
                        }
                    }
                }
                if(event.target.id == 'fastaSelectAllBox')
                {
                    parentView.data.searchFilter = buildInclusiveSearchFilter(parentView.data.filterString);
                    for(let i = 0; i != parentView.data.fastaInputs.length; ++i)
                    {
                        if(parentView.data.searchFilter.test(parentView.data.fastaInputs[i].alias))
                        {
                            parentView.data.fastaInputs[i].checked = event.target.checked;
                        }
                    }
                    parentView.dataChanged();
                    return;    
                }
                if(event.target.id == 'indexButton')
                {
                    parentView.data.searchFilter = buildInclusiveSearchFilter(parentView.data.filterString);
                    for(let i = 0; i != parentView.data.fastaInputs.length; ++i)
                    {
                        if(parentView.data.searchFilter.test(parentView.data.fastaInputs[i].alias))
                        {
                            if(parentView.data.fastaInputs[i].checked)
                                input.indexFasta(parentView.data.fastaInputs[i].name);
                        }
                    }
                }
                //host/patho radios are identified by _host or _path appended to the end 
                //of the item's .validID property
                var type = event.target.id.substr(event.target.id.length-5,event.target.id.length);
                if(type == "_host" || type == "_path" && event.target.checked)
                {
                    console.log('identified radio');
                    //the user clicked a host/patho radio button
                    //extract the id actual id of the item that was clicked
                    var ID = event.target.id.substr(0,event.target.id.length-5);
                    for(let i = 0; i != parentView.data.fastaInputs.length; ++i)
                    {
                        if(parentView.data.fastaInputs[i].validID == ID)
                        {
                            console.log('found item');
                            if(type == "_host")
                            {
                                parentView.data.fastaInputs[i].host = true;
                                parentView.data.fastaInputs[i].pathogen = false;
                                parentView.data.fastaInputs[i].type = "host";
                                parentView.dataChanged();
                                return;
                            }
                            if(type == "_path")
                            {
                                parentView.data.fastaInputs[i].host = false;
                                parentView.data.fastaInputs[i].pathogen = true;
                                parentView.data.fastaInputs[i].type = "path";
                                parentView.dataChanged();
                                return;
                            }
                        }
                    }
                }
            }
            dataChanged(parentView)
            {
                input.postFastaInputs();
            }
        }
    );
}
