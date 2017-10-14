const pjson = require("./../package.json");

if(/beta/.test(pjson.version))
    console.log("beta");
else
    console.log("stable");