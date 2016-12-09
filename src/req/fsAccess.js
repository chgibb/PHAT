var url = require('url')
var path = require('path');

module.exports = function(filePath)
{
    return url.format
    (
        {
            protocol: 'file',
            slashes: true,
            pathname: path.join(process.cwd(), filePath)
        }
    );
}