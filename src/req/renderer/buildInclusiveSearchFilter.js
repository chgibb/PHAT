//Build an inclusive, case insensitive regex of the form /(.*)str(.*)/i
//Return a regex which will match against everything if str is undefined
module.exports = function(str)
{
    var regex = new RegExp("","i");
    if(str)
    {
        regex = new RegExp
        (
            "(.*)("+
            replace
            (
                str,
                "[.]","\\."
            )+
            ")(.*)","i"
        );
    }
    return regex;
}
var replace = function(str,oldt,newt)
{
	var res = str;
	res = res.replace(new RegExp(oldt,"g"),newt);
	return res;
}