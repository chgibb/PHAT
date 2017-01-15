module.exports.insertLeadingPadToSize = function(str,digits,padChar)
{
    if(str.length == digits)
        return str;
    if(!digits || digits == 0)
            return "";
    if(str.length > digits)
        return "";
    var res = "";
    var zeroesToAdd = digits - str.length;
    for(var i = 0; i != zeroesToAdd; ++i)
        res += padChar;
    res += str;
    return res;
}
module.exports.formatDateStamp = function(str)
{
    //assuming a string of the format YYYYMMDDHHMMSSmSmSmS
    //split it into YYYY-MM-DD HH:MM:SS:mSmSmS

    var res = "";
    for(var i = 0; i != str.length; i++)
    {
        res += str[i];
        if(i == 3)
            res += "-";
        if(i == 5)
            res += "-";
        if(i == 7)
            res += " ";
        if(i == 9)
            res += ":";
        if(i == 11)
            res += ":";
        if(i == 13)
            res += ":";
    }
    return res;
}
module.exports.generateFixedSizeDateStamp = function()
{
    var date = new Date();
    return date.getFullYear().toString() + 
    //date.getMonth() starts January at month 0 for some reaon.
    module.exports.insertLeadingPadToSize((parseInt(date.getMonth().toString())+1).toString(),2,"0") + 
    module.exports.insertLeadingPadToSize(date.getDate().toString(),2,"0") + 
    module.exports.insertLeadingPadToSize(date.getHours().toString(),2,"0") + 
    module.exports.insertLeadingPadToSize(date.getMinutes().toString(),2,"0") + 
    module.exports.insertLeadingPadToSize(date.getSeconds().toString(),2,"0") + 
    module.exports.insertLeadingPadToSize(date.getMilliseconds().toString(),3,"0");
}