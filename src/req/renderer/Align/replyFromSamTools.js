var replyFromSamToolsView = require('./replyFromSamToolsView');
var replyFromSamToolsSort = require('./replyFromSamToolsSort');
var replyFromSamToolsIndex = require('./replyFromSamToolsIndex');
module.exports = function(channel,arg,model)
{
    if(arg.args[0] == "view")
        replyFromSamToolsView(channel,arg,model);
    if(arg.args[0] == "sort")
        replyFromSamToolsSort(channel,arg,model);
    if(arg.args[0] == "index")
        replyFromSamToolsIndex(channel,arg,model);
}