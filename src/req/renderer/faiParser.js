module.exports.getContigs = function(file)
{
    var res = new Array();
    var fs = require('fs');
    var tokens = fs.readFileSync(file).toString().split(new RegExp("[ ]|[\t]|[\n]"));
    for(var i = 0; i <= tokens.length; i += 5)
    {
        if(tokens[i])
            res.push(tokens[i]);
    }
    return res;
}