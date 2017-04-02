const vm = require("vm");
const fs = require("fs");
function bootStrapCodeCache(jsFile,jsModule,cdata)
{
    let cache;
	try
	{
	    cache = fs.readFileSync(cdata);
		let compiledCode = new vm.Script(
		fs.readFileSync(jsFile),{
		    filename : jsFile,
		    lineOffset : 0,
		    displayErrors : true,
		    cachedData : cache
		});
		if(!compiledCode.cachedDataRejected)
		{
		    console.log("Successfully loaded from "+cdata);
			compiledCode.runInThisContext();
		}
		else
		{
		    console.log("Cached code "+cdata+" was rejected.");
			require(jsModule);
		}
	}
	catch(err)
	{
	    console.log("Could not load "+cdata);
		let code = fs.readFileSync(jsFile);
		let compiler = new vm.Script(
		code,{
		    filename : jsFile,
			lineOffset : 0,
			displayErrors : true,
			produceCachedData : true
		});
		if(compiler.cachedDataProduced)
		{
		    cache = compiler.cachedData
			console.log("Successfully compiled "+jsFile);
			try
			{
			    fs.writeFileSync(cdata,cache);
				bootStrapCode(jsFile,jsModule,cdata);
			}
			catch(err)
			{
			    console.log("Failed to write "+cdata);
				require(jsModule);
			}
		}
		else
		{
		    console.log("Could not compile "+jsFile);
			require(jsModule);
		}
	}
}
module.exports = bootStrapCodeCache;