var url = require('url')
var path = require('path');

module.exports = function(filePath,addProtocol = true)
{
    if(addProtocol)
    {
        return url.format
        (
            {
                protocol: 'file',
                slashes: true,
                pathname: path.join(process.cwd(),filePath)
            }
        );
    }
    else
        return path.join(process.cwd(),filePath);
}