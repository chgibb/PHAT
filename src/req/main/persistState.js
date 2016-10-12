var jsonFile = require('jsonfile');
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
	}*/
	try
	{
		var fs = require("fs").mkdirSync("rt");
	}
	catch(err){}
	jsonFile.writeFileSync('rt/rt.json',state,{spaces : 4});
	module.exports.persistTicks = 0;
}
