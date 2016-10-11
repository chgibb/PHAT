module.exports = function(bytes)
{
    var kb = 1000;
    var ndx = Math.floor(Math.log(bytes) / Math.log(kb));
    var fileSizeTypes = ["bytes", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];

    var res = "";
    //more than a megabyte
    if(bytes >= 1000000)
        res += +(bytes/kb/kb).toFixed(2)+fileSizeTypes[ndx];
    else
        res += +(bytes/kb).toFixed(2)+fileSizeTypes[ndx];
    return res;
}