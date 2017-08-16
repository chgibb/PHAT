/**
 * Functions for formatting (primarily bowtie2) dates.
 * @module req/renderer/dateFormat
 */
/**
 * Pads a string to reach a designated size.
 * @param {string} str - String to pad
 * @param {number} digits - Size to expand string to
 * @param {string} padChar - Character to use to pad string
 * @returns {string} - Padded string
 */
//module.exports.insertLeadingPadToSize = function(str,digits,padChar)
export function insertLeadingPadToSize(str : string,digits : number,padChar : string) : string
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

/**
 * @param {string} str - Takes in a string of the format YYYYMMDDHHMMSSmSmSmS were mS is one digit, representing milliseconds
 * @returns {string} - String of the form YYYY-MM-DD HH:MM:SS:mSmSmS
 */
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
/**
 * @returns {string} - Date stamp of size 17 of the format YYYYMMDDHHMMSSmSmSmS
 */
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