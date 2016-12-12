var viewMgr = require('./../viewMgr');
var id = require('./../MakeValidID.js');

var fs = require('fs');
module.exports = function(arr,div)
{
    arr.push
    (
        new class extends viewMgr.View
        {
            constructor()
            {
                super('report',div);
                this.data.report = "";
            }
            onMount(){}
            onUnMount(){}
            renderView()
            {
                if(document.getElementById('reportIsOpen') || !this.data.report)
                    return;
                var html = "";
                html += "<br /><button id='goBack'>Go Back</button><br/>";  
                var report = fs.readFileSync("resources/app/"+this.data.report+"/fastqc_report.html").toString();
                //add a hidden div that we can test for to determine if a report is open or not.
                report += "<div id='reportIsOpen'></div>"; 
                html += report;
                return html;
            }
            postRender(){}
            divClickEvents()
            {
                if(!event || !event.target || !event.target.id)
                    return;
                if(event.target.id == "goBack")
                {
                    this.data.report = "";
                    viewMgr.changeView('summary');
                    return;
                }
            }
            dataChanged(){}
        }
    );
}
