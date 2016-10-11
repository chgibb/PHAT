var fs = require('fs');
module.exports = function(file)
{
    try
    {
        fs.accessSync(file,fs.F_OK | fs.R_OK);
    }
    catch(err)
    {
        return false;
    }
    return true;
}