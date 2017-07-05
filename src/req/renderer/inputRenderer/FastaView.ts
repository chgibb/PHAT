const Dialogs = require("dialogs");
const dialogs = Dialogs();

import {View} from "./../viewMgr";
import Input from "./../Input";
import {getPath,importIntoProject} from "./../../file";

var buildInclusiveSearchFilter = require('./../buildInclusiveSearchFilter.js');

export class FastaView extends View
{
    public searchFilter : RegExp;
    public filterString : string;
    public model : Input;
    public constructor(div : string,model : Input)
    {
        super('fasta',div,model);
        this.searchFilter = new RegExp("","i");
        this.filterString = "";
    }
    onMount(){}
    onUnMount(){}
    renderView() : string
    {
        if(document.getElementById('fastaInputFilterBox'))
            this.filterString = (<HTMLInputElement>document.getElementById('fastaInputFilterBox')).value;
        var html = new Array();
        html.push
        (
            "<img src='img/indexButton.png' style='margin:0px 18px 18px 18px;' class='viewTab' id='indexButton'>",
            "<input id='fastaInputFilterBox' style='margin-left:-400px;' class='inputFilterBox' type='text' autofocus='autofocus' placeholder='Search' />",
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
        this.searchFilter = buildInclusiveSearchFilter(this.filterString);
        for(let i = 0; i != this.model.fastaInputs.length; ++i)
        {
            if(this.searchFilter.test(this.model.fastaInputs[i].alias))
			{
                html.push
		        (
			        "<tr><td><input type='checkbox' id='",this.model.fastaInputs[i].uuid,"'></input></td>",
			        "<td id='",this.model.fastaInputs[i].uuid+"_p","'>",this.model.fastaInputs[i].alias,"</td>",
			        `<td id="${this.model.fastaInputs[i].uuid}Import" class="activeHover">`,this.model.fastaInputs[i].imported ? "In Project" : getPath(this.model.fastaInputs[i]) ,"</td>",
			        "<td>",this.model.fastaInputs[i].sizeString,"</td>",
                    "<td>","<input type='radio' id='",this.model.fastaInputs[i].uuid+"_path","' name='",this.model.fastaInputs[i].uuid,"'></input></td>",
                    "<td>","<input type='radio' id='",this.model.fastaInputs[i].uuid+"_host","' name='",this.model.fastaInputs[i].uuid,"'></input></td>",
                    "<td>",this.model.fastaInputs[i].indexed,"</td>",
			        "</tr>"
		        );
            }
        }
        html.push("</table>");
        return html.join('');
    }
    postRender()
    {
        if(this.filterString)
            (<HTMLInputElement>document.getElementById('fastaInputFilterBox')).value = this.filterString;
        var shouldCheckCheckAllBox = true;
        for(let i = 0; i != this.model.fastaInputs.length; ++i)
        {
            if(this.model.fastaInputs[i].checked)
            {
                $('#'+this.model.fastaInputs[i].uuid).prop("checked",true);
            }
            if(this.searchFilter.test(this.model.fastaInputs[i].alias))
            {
                if(!this.model.fastaInputs[i].checked)
                    shouldCheckCheckAllBox = false;
            }
        }
        var me = this;
        $('#fastaInputFilterBox').on
        (
            'change keydown keyup paste',
            function()
            {
                me.data.filterString = (<HTMLInputElement>document.getElementById('fastaInputFilterBox')).value;
                me.render();
            }
        );
        $('#fastaSelectAllBox').prop("checked",shouldCheckCheckAllBox);
        document.getElementById('fastaInputFilterBox').focus();
    }
    divClickEvents(event : JQueryEventObject)
    {
        //alert(JSON.stringify(event,undefined,4));
        //potentially error or user clicked on something we're not interested in
        if(!event || !event.target || !event.target.id)
            return;
        //checkboxs are the most likely to be clicked
        if(event.target.id != 'fastaSelectAllBox')
        {
            if((<HTMLInputElement>event.target).checked)
            {
                for(let i = 0; i != this.model.fastaInputs.length; ++i)
                {
                    if(this.model.fastaInputs[i].uuid == event.target.id)
                    {
                        this.model.fastaInputs[i].checked = true;
                        this.dataChanged();
                        return;
                    }
                }
            }
            if(!(<HTMLInputElement>event.target).checked)
            {
                for(let i = 0; i != this.model.fastaInputs.length; ++i)
                {
                    if(this.model.fastaInputs[i].uuid == event.target.id)
                    {
                        this.model.fastaInputs[i].checked = false;
                        this.dataChanged();
                        return;
                    }
                }
            }
        }
        if(event.target.id == 'fastaSelectAllBox')
        {
            this.searchFilter = buildInclusiveSearchFilter(this.filterString);
            for(let i = 0; i != this.model.fastaInputs.length; ++i)
            {
                if(this.searchFilter.test(this.model.fastaInputs[i].alias))
                {
                    this.model.fastaInputs[i].checked = (<HTMLInputElement>event.target).checked;
                }
            }
            this.dataChanged();
            return;
        }
        if(event.target.id == 'indexButton')
        {
            this.searchFilter = buildInclusiveSearchFilter(this.filterString);
            for(let i = 0; i != this.model.fastaInputs.length; ++i)
            {
                if(this.searchFilter.test(this.model.fastaInputs[i].alias))
                {
                    if(this.model.fastaInputs[i].checked)
                        this.model.indexFasta(this.model.fastaInputs[i]);
                }
            }
        }
        for(let i = 0; i != this.model.fastaInputs.length; ++i)
        {
            if(event.target.id == `${this.model.fastaInputs[i].uuid}Import` && !this.model.fastaInputs[i].imported)
            {
                dialogs.confirm(
                    `Copy ${this.model.fastaInputs[i].alias} into project?`,
                    ``,
                    (ok : boolean) => {
                        if(ok)
                        {
                            importIntoProject(this.model.fastaInputs[i]);
                            this.dataChanged();
                        }
                    }
                );
                return;
            }
        }
    }
    dataChanged()
    {
        this.model.postFastaInputs();
    }
}
export function addView(arr : Array<View>,div : string,model : Input) : void
{
    arr.push(new FastaView(div,model));
}
