/**
 * Utility functions for creating a valid HTML ID from a string
 * @module req/renderer/makeValidID
 */
module.exports.replace = function(str,oldt,newt)
{
	var res = str;
	res = res.replace(new RegExp(oldt,"g"),newt);
	return res;
}
/**
 * Creates a valid HTML ID from a string
 * @param {string} str - String to create ID for
 * @returns {string} - Valid HTML ID of str
 */
module.exports.makeValidID = function(str)
{
	res = str;
	res = module.exports.replace(res," ","_");
	res = module.exports.replace(res,"[.]","_");
	res = module.exports.replace(res,"/","a");
	res = module.exports.replace(res,"\\\\","a");
	res = module.exports.replace(res,":","a");
	res = module.exports.replace(res,"[(]","_");
	res = module.exports.replace(res,"[)]","_");
	return res;
}
module.exports.findOriginalInput = function(str,inputs)
{
	for(let i = 0; i != inputs.length; ++i)
	{
		if(module.exports.makeValidID(inputs[i].name) === str)
			return inputs[i].name;
	}
}
