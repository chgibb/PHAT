module.exports.replace = function(str,oldt,newt)
{
	var res = str;
	res = res.replace(new RegExp(oldt,"g"),newt);
	return res;
}
module.exports.makeValidID = function(str)
{
	res = str;
	res = module.exports.replace(res," ","_");
	res = module.exports.replace(res,"[.]","_");
	res = module.exports.replace(res,"/","a");
	res = module.exports.replace(res,"[(]","_");
	res = module.exports.replace(res,"[)]","_");
	return res;
}
module.exports.findOriginalInput = function(str,inputs)
{
	for(i in inputs)
	{
		if(module.exports.makeValidID(inputs[i].name) === str)
			return inputs[i].name;
	}
}
