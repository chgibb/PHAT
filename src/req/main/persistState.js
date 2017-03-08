var jsonFile = require('jsonfile');
var fsAccess = require('./../fsAccess').default;
//tick # to persist at
module.exports.persistTick = 5;
//current ticks
module.exports.persistTicks = 0;
module.exports.persistState = function(force)
{
	/*if(!force)
	{
		if(module.exports.persistTicks <= module.exports.persistTick)
		{
			module.exports.persistTicks++;
			return;
		}
	}
	try
	{
		var fs = require("fs").mkdirSync("resources/app/rt");
	}
	catch(err){}
    try
    {
	    jsonFile.writeFileSync("resources/app/rt/rt.json",state,{spaces : 4});
    }
    catch(err)
    {
        console.log(err);
    }
	module.exports.persistTicks = 0;*/
}
