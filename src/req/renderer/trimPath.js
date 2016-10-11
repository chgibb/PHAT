module.exports = function(str)
{
	var rev = "";
	var res = "";
	for(var i = str.length - 1; i >= 0; --i)
	{
		if(str[i] != "\\" && str[i] != "/")
			rev += str[i];
		if(str[i] == "\\" || str[i] == "/")
			break;
	}
	for(var i = rev.length - 1; i >= 0; --i)
	{
		res += rev[i];
	}
	return res;
}