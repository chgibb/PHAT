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
                super('fastq',div);
                this.data.fastqInputs = new Array();
                this.data.searchFilter = new RegExp("","i");
                this.data.filterString = "";
            }
            onMount(){}
            onUnMount(){}
            renderView(parentView)
            {
                if(document.getElementById('fastqInputFilterBox'))
                    parentView.data.filterString = document.getElementById('fastqInputFilterBox').value;
                var html = new Array();
                html.push
                (
                    "<input id='fastqInputFilterBox' class='inputFilterBox' type='text' autofocus='autofocus' placeholder='Search' />",
                    "<table id='fastqTable' style='width:100%'>",
                    "<tr>",
                    "<td><input type='checkbox' id='fastqSelectAllBox'></input></td>",
                    "<th>Sample Name</th>",
                    "<th>Directory</th>",
                    "<th>Size</th>",
                    "</tr>"
                );
                parentView.data.searchFilter = buildInclusiveSearchFilter(parentView.data.filterString);

                for(var i in parentView.data.fastqInputs)
                {
                    if(parentView.data.searchFilter.test(parentView.data.fastqInputs[i].alias))
                    {
		        	    html.push
		        	    (
			        	    "<tr><td><input type='checkbox' id='",parentView.data.fastqInputs[i].validID,"'></input></td>",
			        	    "<td>",parentView.data.fastqInputs[i].alias,"</td>",
			        	    "<td>",parentView.data.fastqInputs[i].name,"</td>",
			        	    "<td>",parentView.data.fastqInputs[i].sizeString,"</td>",
			        	    "</tr>"
                        );
                    }
	            }
	            html.push("</table>");
                return html.join('');
            }
            postRender(parentView)
            {
                //restore text in search box
                if(parentView.data.filterString)
                    document.getElementById('fastqInputFilterBox').value = parentView.data.filterString;
                var shouldCheckCheckAllBox = true;
                for(var i in parentView.data.fastqInputs)
                {
                    //restore state of checkboxes
                    if(parentView.data.fastqInputs[i].checked)
                    {
                        $('#'+parentView.data.fastqInputs[i].validID).prop("checked",true);
                    }
                    //check the check all box if all visible items have been checked
                    if(parentView.data.searchFilter.test(parentView.data.fastqInputs[i].alias))
                    {
                        if(!parentView.data.fastqInputs[i].checked)
                            shouldCheckCheckAllBox = false;
                    }
                }
                //reset change handler to inputFilterBox
                $('#fastqInputFilterBox').on
                (
                    'change keydown keyup paste',
                    function()
                    {
                        parentView.data.filterString = document.getElementById('fastqInputFilterBox').value;
                        parentView.render();
                    }
                );
                //apply prop to check all box
                $('#fastqSelectAllBox').prop("checked",shouldCheckCheckAllBox);
                //refocus search box if the user is using it
                document.getElementById('fastqInputFilterBox').focus();
            }
            dataChanged()
            {
                //The renderer window will recieve a reply from the main process
                //after input posts the updated data and trigger a rerender with the new data.
                //No need to do so here.
                input.postFastqInputs();
            }
            divClickEvents(parentView,event)
            {
                //potentially error or user clicked on something we're not interested in 
                if(!event || !event.target || !event.target.id)
                    return;
                //instead of immediately looping to figure out if a checkbox was even clicked,
                //this is a reasonable check to ensure a checkbox was (maybe) clicked
                if(event.target.id != 'fastqSelectAllBox')
                {
                    //if name is defined then a checkbox was actually clicked
                    var name = id.findOriginalInput(event.target.id,parentView.data.fastqInputs);
                    //checkbox was clicked
                    if(name !== undefined)
                    {
                        if(event.target.checked)
                        {
                            for(var i in parentView.data.fastqInputs)
                            {
                                if(parentView.data.fastqInputs[i].name == name)
                                {
                                    parentView.data.fastqInputs[i].checked = true;
                                    parentView.dataChanged();
                                    return;
                                }
                            }
                        }
                        if(!event.target.checked)
                        {
                            for(var i in parentView.data.fastqInputs)
                            {
                                if(parentView.data.fastqInputs[i].name == name)
                                {
                                    parentView.data.fastqInputs[i].checked = false;
                                    parentView.dataChanged();
                                    return;
                                }
                            }
                        }
                    }
                }
                //on user clicking the select all box
                if(event.target.id == 'fastqSelectAllBox')
                {
                    parentView.data.searchFilter = buildInclusiveSearchFilter(parentView.data.filterString);
                    for(var i in parentView.data.fastqInputs)
                    {
                        //for anything currently visible
                        if(parentView.data.searchFilter.test(parentView.data.fastqInputs[i].alias))
                        {
                            //set the checked state to that of the select all checkbox
                            parentView.data.fastqInputs[i].checked = event.target.checked;
                        }
                    }
                    //inform the renderer of an update
                    parentView.dataChanged();    
                }
            }
        }
    );
}
