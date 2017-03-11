import {View} from "./../viewMgr";
import {makeValidID,findOriginalInput} from "./../MakeValidID";
import Input from "./../Input";
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
			        "<tr><td><input type='checkbox' id='",makeValidID(this.model.fastaInputs[i].name),"'></input></td>",
			        "<td id='",makeValidID(this.model.fastaInputs[i].name)+"_p","'>",this.model.fastaInputs[i].alias,"</td>",
			        "<td>",this.model.fastaInputs[i].name,"</td>",
			        "<td>",this.model.fastaInputs[i].sizeString,"</td>",
                    "<td>","<input type='radio' id='",makeValidID(this.model.fastaInputs[i].name)+"_path","' name='",makeValidID(this.model.fastaInputs[i].name),"'></input></td>",
                    "<td>","<input type='radio' id='",makeValidID(this.model.fastaInputs[i].name)+"_host","' name='",makeValidID(this.model.fastaInputs[i].name),"'></input></td>",
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
                $('#'+this.model.fastaInputs[i].validID).prop("checked",true);
            }
            if(this.model.fastaInputs[i].host)
                $('#'+this.model.fastaInputs[i].validID+'_host').prop("checked",true);
            if(this.model.fastaInputs[i].pathogen)
                $('#'+this.model.fastaInputs[i].validID+'_path').prop("checked",true);
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
            var name = findOriginalInput(event.target.id,this.model.fastaInputs);
            //checkbox was clicked
            if(name !== undefined)
            {
                if((<HTMLInputElement>event.target).checked)
                {
                    for(let i = 0; i != this.model.fastaInputs.length; ++i)
                    {
                        if(this.model.fastaInputs[i].name == name)
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
                        if(this.model.fastaInputs[i].name == name)
                        {
                            this.model.fastaInputs[i].checked = false;
                            this.dataChanged();
                            return;
                        }
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
                        this.model.indexFasta(this.model.fastaInputs[i].name);
                }
            }
        }
        //host/patho radios are identified by _host or _path appended to the end
        //of the item's .validID property
        var type = event.target.id.substr(event.target.id.length-5,event.target.id.length);
        if(type == "_host" || type == "_path" && (<HTMLInputElement>event.target).checked)
        {
            console.log('identified radio');
            //the user clicked a host/patho radio button
            //extract the id actual id of the item that was clicked
            var ID = event.target.id.substr(0,event.target.id.length-5);
            for(let i = 0; i != this.model.fastaInputs.length; ++i)
            {
                if(this.model.fastaInputs[i].validID == ID)
                {
                    console.log('found item');
                    if(type == "_host")
                    {
                        this.model.fastaInputs[i].host = true;
                        this.model.fastaInputs[i].pathogen = false;
                        this.model.fastaInputs[i].type = "host";
                        this.dataChanged();
                        return;
                    }
                    if(type == "_path")
                    {
                        this.model.fastaInputs[i].host = false;
                        this.model.fastaInputs[i].pathogen = true;
                        this.model.fastaInputs[i].type = "path";
                        this.dataChanged();
                        return;
                    }
                }
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
