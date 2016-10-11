function getStatus(token)
{
    if(token.match(new RegExp("(pass)")))
        return "pass";
    if(token.match(new RegExp("(warn)")))
        return "warn";
    if(token.match(new RegExp("(fail)")))
        return "fail";
}
//Parse fastqc report and return status codes for analyses we're interested in.
module.exports.getQCReportSummaries = function(report)
{
    var res = new Array();
    var tokens = require('fs').readFileSync(report).toString().split(new RegExp("[\n]"));
    for(let i = 0; i != tokens.length; ++i)
    {
        //all analyses start and end with ">>"
        if(tokens[i].match(new RegExp("(>>)")))
        {
            if(tokens[i].match(new RegExp("(Basic Stastics)")))
                res.push({name : "Basic Stastics", status : getStatus(tokens[i])});

            if(tokens[i].match(new RegExp("(Per base sequence quality)")))
                res.push({name : "Per base sequence quality", status : getStatus(tokens[i])});
            
            if(tokens[i].match(new RegExp("(Per sequence quality scores)")))
                res.push({name : "Per sequence quality scores",status : getStatus(tokens[i])});

            if(tokens[i].match(new RegExp("(Per sequence GC content)")))
                res.push({name : "Per sequence GC content",status : getStatus(tokens[i])});

            if(tokens[i].match(new RegExp("(Sequence Duplication Levels)")))
                res.push({name : "Sequence Duplication Levels",status : getStatus(tokens[i])});

            if(tokens[i].match(new RegExp("(Overrepresented sequences)")))
                res.push({name : "Overrepresented sequences",status : getStatus(tokens[i])});
        }
    }
    if(res === new Array())
        throw "Could not find "+report;
    return res;
}
