import {View} from "./../viewMgr";
import Input from "./../Input";
import {getPath} from "./../../file";

var buildInclusiveSearchFilter = require('./../buildInclusiveSearchFilter.js');
export class FastqView extends View
{
    public searchFilter : RegExp;
    public filterString : string;
    public model : Input;
    public constructor(div : string,model : Input)
    {
        super('fastq',div,model);
        this.searchFilter = new RegExp("","i");
        this.filterString = "";
    }
    onMount(){}
    onUnMount(){}
    renderView() : string
    {
        if(document.getElementById('fastqInputFilterBox'))
            this.filterString = (<HTMLInputElement>document.getElementById('fastqInputFilterBox')).value;
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
        this.searchFilter = buildInclusiveSearchFilter(this.filterString);

        for(let i = 0; i != this.model.fastqInputs.length; ++i)
        {
            if(this.searchFilter.test(this.model.fastqInputs[i].alias))
            {
		        html.push
		        (
			        "<tr><td><input type='checkbox' id='",this.model.fastqInputs[i].uuid,"'></input></td>",
			        "<td>",this.model.fastqInputs[i].alias,"</td>",
			        "<td>",getPath(this.model.fastqInputs[i]),"</td>",
			        "<td>",this.model.fastqInputs[i].sizeString,"</td>",
			        "</tr>"
                );
            }
	    }
	    html.push("</table>");
        return html.join('');
    }
    postRender()
    {
        //restore text in search box
        if(this.filterString)
            (<HTMLInputElement>document.getElementById('fastqInputFilterBox')).value = this.filterString;
        var shouldCheckCheckAllBox = true;
        for(let i = 0; i != this.model.fastqInputs.length; ++i)
        {
            //restore state of checkboxes
            if(this.model.fastqInputs[i].checked)
            {
                $('#'+this.model.fastqInputs[i].uuid).prop("checked",true);
            }
            //check the check all box if all visible items have been checked
            if(this.searchFilter.test(this.model.fastqInputs[i].alias))
            {
                if(!this.model.fastqInputs[i].checked)
                    shouldCheckCheckAllBox = false;
            }
        }
        var me = this;
        //reset change handler to inputFilterBox
        $('#fastqInputFilterBox').on
        (
            'change keydown keyup paste',
            function()
            {
                me.data.filterString = (<HTMLInputElement>document.getElementById('fastqInputFilterBox')).value;
                me.render();
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
        this.model.postFastqInputs();
    }
    divClickEvents(event : JQueryEventObject) : void
    {
        //potentially error or user clicked on something we're not interested in 
        if(!event || !event.target || !event.target.id)
            return;
        //instead of immediately looping to figure out if a checkbox was even clicked,
        //this is a reasonable check to ensure a checkbox was (maybe) clicked
        if(event.target.id != 'fastqSelectAllBox')
        {
            if((<HTMLInputElement>event.target).checked)
            {
                for(let i = 0; i != this.model.fastqInputs.length; ++i)
                {
                    if(this.model.fastqInputs[i].uuid == event.target.id)
                    {
                        this.model.fastqInputs[i].checked = true;
                        this.dataChanged();
                        return;
                    }
                }
            }
            if(!(<HTMLInputElement>event.target).checked)
            {
                for(let i = 0; i != this.model.fastqInputs.length; ++i)
                {
                    if(this.model.fastqInputs[i].uuid == event.target.id)
                    {
                        this.model.fastqInputs[i].checked = false;
                        this.dataChanged();
                        return;
                    }
                }
            }
        }
        //on user clicking the select all box
        if(event.target.id == 'fastqSelectAllBox')
        {
            this.searchFilter = buildInclusiveSearchFilter(this.filterString);
            for(let i = 0; i != this.model.fastqInputs.length; ++i)
            {
                //for anything currently visible
                if(this.searchFilter.test(this.model.fastqInputs[i].alias))
                {
                    //set the checked state to that of the select all checkbox
                    this.model.fastqInputs[i].checked = (<HTMLInputElement>event.target).checked;
                }
            }
            //inform the renderer of an update
            this.dataChanged();    
        }
    }
}
export function addView(arr : Array<View>,div : string,model : Input) : void
{
    arr.push(new FastqView(div,model));
}
