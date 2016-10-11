/*
Where report is a string of the full report text.
options is of the form
{
    reads : bool,
    mates : bool,
    overallAlignmentRate : bool
}
Each true property will indicate that it is selected to be parsed from the report
Will return an object of the form
{
    reads : int,
    mates : int,
    overallAlignmentRate : float
}
*/
module.exports.parseBowTie2AlignmentReport = function(report)
{
    //console.log(report);
   /* if(!options)
        return;*/
    //var res = options;

    var res = {};

    var tokens = report;

    //There's a bug in JobIPC's unbuffering of Bowtie2's output.
    //It picks up an undefined value at the beginning of the buffer which gets coerced to a string and 
    //prefixed to the text. Trim it off before we parse the report.
    //<hack>
    if(report.match(new RegExp("(undefined)","g")))
        tokens = tokens.substring(9,tokens.length);
    //</hack>
    tokens = tokens.split(new RegExp("[ ]|[\n]|[\t]"));

    //console.log(tokens);
    
    for(var i = 0; i != tokens.length; i++)
    {
            if(tokens[i].match(new RegExp("(reads;)","g")))
            {
                res.reads = parseInt(tokens[i-1]);
            }
            if(tokens[i].match(new RegExp("(mates)","g")))
            {
                res.mates = parseInt(tokens[i-1]);
            }
            if(tokens[i].match(new RegExp("(overall)","g")))
            {
                res.overallAlignmentRate = parseFloat(tokens[i-1].substring(0,tokens[i-1].length-1));
            }
    }
    return res;
    
}