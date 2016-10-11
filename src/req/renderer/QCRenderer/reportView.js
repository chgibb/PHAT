var view = require('./../view.js');
var id = require('./../MakeValidID.js');
module.exports = function(arr,div)
{
    arr.push
    (
        new class extends view.View
        {
            constructor()
            {
                super('report',div);
                this.data.report = "";
            }
            onMount(){}
            onUnMount(){}
            renderView(parentView)
            {
                if(document.getElementById('reportIsOpen') || !parentView.data.report)
                    return;
                var html = "";
                html += "<br /><button id='goBack'>Go Back</button><br/>";
                var fs = require('fs');
                var report = fs.readFileSync("resources/app/"+parentView.data.report+"/fastqc_report.html").toString();
                //add a hidden div that we can test for to determine if a report is open or not.
                report += "<div id='reportIsOpen'></div>"; 
                html += report;
                return html;
            }
            postRender(parentView){}
            divClickEvents(parentView)
            {
                if(!event || !event.target || !event.target.id)
                    return;
                if(event.target.id == "goBack")
                {
                    parentView.data.report = "";
                    changeView('summary');
                    return;
                }
            }
            dataChanged(parentView){}
        }
    );
}
